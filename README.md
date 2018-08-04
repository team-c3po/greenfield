# STUD(y)

**STUD(y)** is an application that allows users to find optimal study locations in close proximity to them.

By leveraging crowdsourced user ratings for local cafes, **STUD(y)** users can indicate their preferences,
and **STUD(y)** will return results that are tailored to that specific user.

## Team

- **Product Owner**: [Daniel Guan (@StrykeBack)](https://github.com/StrykeBack)
- **Scrum Master**: [Erik Lin (@lin-erik)](https://github.com/lin-erik)
- **Development Team Members**: [Debbie Lee (@DebbieLittle)](https://github.com/DebbieLittle), [Edward Kye (@ekye121)](https://github.com/ekye121)

## Table of Contents

1.  [Usage](#Usage)
1.  [Requirements](#requirements)
1.  [Development](#development)
    1.  [Installing Dependencies](#installing-dependencies)
    1.  [Tasks](#tasks)
1.  [Team](#team)
1.  [Contributing](#contributing)

## Usage

> Search a location in the bar to find study spots near the location
> Because our database has minimal data, please search "Hack Reactor NYC" and click 2Beans for existing reviews

## Requirements

- Node.js
- Yelp API Key
- MySQL ^5.7.x


## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Database

Open the file server/db/config.example.js to set up the credentials for your own database. The current setup in the file is for AWS.

Once complete, change the name of the file to config.js

## Contributing

See [CONTRIBUTING.md](_CONTRIBUTING.md) for contribution guidelines.
