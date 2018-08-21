<div style="text-align:center"><img style="width:200px; height:200px" src="https://rawgit.com/tomkallen/datafield/master/docs/datafield.png" /></div>

<h4 style="color:#f00">version 0.2.0 is out</h3>  
Sort, select, filter and perform maths and analysis on your arrays of data

[![codecov](https://codecov.io/gh/tomkallen/datafield/branch/master/graph/badge.svg)](https://codecov.io/gh/tomkallen/datafield)
[![Build Status](https://travis-ci.org/tomkallen/datafield.svg?branch=master)](https://travis-ci.org/tomkallen/datafield)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm version](https://badge.fury.io/js/datafield.svg)](https://badge.fury.io/js/datafield)


[:page_facing_up: Read the documentation here](https://tomkallen.github.io/datafield/)  
[:cat: Contribute for the greater good](https://github.com/tomkallen/datafield/blob/master/CONTRIBUTNG.md)   

## What is DataField

DataField is a library that helps you wrangle your awesome collections of data you obtain from different sources.

Imagine you are building a web application that deals with users. You make an API request and receive an array of 100 entries which look like this one below:

    {
      "_id": "5b420ae94fe6464ff91f5de8",
      "index": 0,
      "guid": "871eebf0-9983-4eb5-a0b5-59372a2fbecd",
      "isActive": true,
      "balance": "$1,268.06",
      "age": 41,
      "name": {
        "first": "Pearlie",
        "last": "Osborne"
      },
      "company": "PIVITOL",
      "email": "pearlie.osborne@pivitol.net",
      "phone": "+1 (992) 418-2307",
      "address": "190 River Street, Spelter, Tennessee, 1088",
      "registered": "Monday, April 18, 2016 7:35 AM",
      "tags": ["ad", "magna", "aliqua"],
      "friends": [{"id": 0, "name": "Whitney Snow"}, {"id": 1, "name": "Garza Hernandez"}, {"id": 2,"name": "Lourdes Conley"}]
    } 
      

With this library it is rather easy to perform various actions on your data.

#### How It Works

    const users = new DataField(arrayOfUsers)

Now your data is stored in an instance of DataField class.

Each method that performs any kind of selection or filtering returns a **new instance** of DataField and can be chained.

Math methods return primitives and can not be chained

To extract your data use `.values()` or `toArray()`

  
Lets filter our data. We need users who are 30 years old or older, but not 41 years old and have at least 2 friends, but less than 10. Also we want our list sorted by last name in descending order. Then we are done so we want an array out of that:

    users.where('age').gte(30).not(41).where('friends').range(2, 10).sort({by: 'name.last', order: 'desc'}).toArray()
    
Or you can go more *object-oriented* way (this one below is kinda weird request although):

```js
users.where('age').any({
  range: [8, 88],
  lte: 18,
  gt: 60,
  not: 42,
  is: false
})
```


That's it. API is short and simple.
Also, read the [Documentation](https://tomkallen.github.io/datafield/)

`npm i datafield`
