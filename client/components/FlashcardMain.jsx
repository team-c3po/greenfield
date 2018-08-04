import React from 'react'
import FlashcardApp from 'react-flashcard-app'
import {Button, FormControl, FormGroup, Glyphicon, ButtonToolbar} from 'react-bootstrap'

const axios = require('axios')

class FlashcardMain extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showDeck: false,
            createDeck: false,
            nameOfNewDeck: '',
            frontOfNewCard: '',
            backOfNewCard: '',
            createdDeck: [],
            selectedDeckName: '',
            disabled: true,
            deck: {},
            options: {
                topControlBar: ['downRating', 'reset', 'upRating'],
                bottomControlBar: ['decrement', 'shuffle', 'increment'],
                buttonTexts: {
                    upRating: 'Got Right',
                    downRating: 'Got Wrong',
                    decrement: 'Previous Card',
                    increment: 'Next Card',
                    shuffle: 'Random Card',
                    reset: 'Reset'
                }
            }
        }
        //bind section
        this.toggleStudy = this.toggleStudy.bind(this)
        this.toggleDeckCreation = this.toggleDeckCreation.bind(this)
        this.handleValueChange = this.handleValueChange.bind(this)
        this.handleSaveCard = this.handleSaveCard.bind(this)
        this.handleDeleteCard = this.handleDeleteCard.bind(this)
        this.handleSaveDeck = this.handleSaveDeck.bind(this)
        this.handleDeckChange = this.handleDeckChange.bind(this)
    }

    //method section
    componentDidMount() {
        this.props.fetchDeckNames()
    }

    toggleStudy() {
        let old = this.state.showDeck;
        this.setState({showDeck: !old}, () => window.scrollTo({
            top: 310, behavior: 'smooth'}))
    }

    toggleDeckCreation() {
        let old = this.state.createDeck
        this.setState({createDeck: !old})
    }

    handleValueChange(e) {
        e.preventDefault()
        let key = e.target.id
        this.setState({ [key]: e.target.value })
    }

    handleSaveCard() {
        let id = this.state.createdDeck.length+1
        let front = this.state.frontOfNewCard;
        let back = this.state.backOfNewCard;
        let newCard = {id: id, front: front, back: back}
        let deck = this.state.createdDeck
        deck.push(newCard)
        this.setState({createdDeck: deck, frontOfNewCard: '', backOfNewCard: ''})
    }

    handleDeleteCard(ind) {
        let deck = this.state.createdDeck
        deck.splice(ind, 1)
        deck.forEach((card, i) => card.id = i+1 )
        console.log(deck)
        this.setState({createdDeck: deck})
    }

    handleSaveDeck() {
        let newDeck = {
            id: 1,
            name: this.state.nameOfNewDeck,
            cards: this.state.createdDeck
        }
        this.setState({createdDeck: [], nameOfNewDeck: ''})
        axios.post('/flashcards', {newDeck: newDeck, user_id: this.props.user_id})
             .then((response) => this.props.fetchDeckNames())
             .catch((err) => console.error('something went wrong saving that deck...', err))
        }

    handleDeckChange(e) {
        this.setState({selectedDeckName: e.target.value})
        axios.get('/flashcardDeck', {params: 
                    {user_id: this.props.user_id, deckName: e.target.value}})
             .then((response) => this.setState({deck: response.data, disabled: false}))
             .catch((err) => console.error(err))
    }


    //render section
    render() {
        if (this.state.showDeck) {
            return (
                //Study selected Deck
                <div style={{marginBottom: '45px'}} >
                    <FlashcardApp data = {this.state.deck} options = {this.state.options} />
                    <Button onClick = {this.toggleStudy} bsStyle="warning"
                        >Back to Flashcard Choice
                    </Button>
                </div>
            )
        } else {
            return (
                <div>
                    {
                        this.state.createDeck ?
                        //Deck Creation
                            <div>
                                
                                <div style={{width: '20%'}}>
                                    <FormControl type= 'text' placeholder='Name of New Deck' id = 'nameOfNewDeck'
                                    onChange = {this.handleValueChange} value = {this.state.nameOfNewDeck} 
                                    style={{textAlign: 'center'}} />
                                </div>

                                <Button onClick = {this.handleSaveDeck} 
                                    bsStyle="success" style={{margin: '10px'}} >
                                    Save this deck
                                </Button>
                                <Button onClick = {this.toggleDeckCreation} 
                                    bsStyle="warning" className='backToFlash' >
                                    Back to Flashcard Decks
                                </Button>
                                <br/>

                                
                                <div style={{width: '40%'}} >
                                    <FormControl type='text' placeholder='Front of Card' id = 'frontOfNewCard'
                                    onChange = {this.handleValueChange} value = {this.state.frontOfNewCard} />
                                    <FormControl componentClass="textarea" placeholder='Back of Card' id = 'backOfNewCard'
                                    onChange = {this.handleValueChange} value = {this.state.backOfNewCard} />
                                    
                                    <Button onClick = {this.handleSaveCard} 
                                        bsStyle="primary" style={{margin: '10px'}} >
                                        Save this Card
                                    </Button>
                                </div>
                                
                                <br/>

                                <div className='madeCardContainer'>
                                    {this.state.createdDeck.map((card, ind) => {
                                        return(
                                            <div className='newCardContainer'>
                                                <div className="newCardFront">
                                                    {card.front}
                                                </div>

                                                <div className='newCardBack'>
                                                    {card.back}
                                                </div>
                                                
                                                
                                                <Button onClick={() => this.handleDeleteCard(ind)} 
                                                    className='removeCard' bsStyle='link' >
                                                    <Glyphicon glyph='remove' />
                                                </Button>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
        
                        :
                        //Deck Selection
                        <div style={{width: '42%' }}>
                            <FormControl componentClass='select' onChange={this.handleDeckChange} 
                                placeholder='select a flashcard deck'>
                                <option  value=''>select a flashcard deck</option>
                                {this.props.deckNames.map((name) => {
                                    return(
                                        <option value={name}>{name}</option>
                                    )
                                })}
                            </FormControl>
                            <br/>
                            <Button onClick = {this.toggleStudy}
                                bsStyle='primary' style={{margin: '10px'}} id='studyThisDeck' 
                                disabled = {this.state.disabled ? true : false}
                                >Study this Deck
                            </Button>
                            <Button onClick = {this.toggleDeckCreation}
                                bsStyle='primary' style={{margin: '10px'}}
                                >Create a new flashcard deck
                            </Button>
                        </div>
                    }
                </div>
            )
        }
    }
}

export default FlashcardMain