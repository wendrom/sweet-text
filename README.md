Sweet Text
==========

An engine that makes it easy to create CYOA (choose your own adventure) games
that can be played in a web browser!

# Usage

## Branch

Sweet Text uses 'Branch' objects to map out the text, actions and choices of the
game.

e.g.
```
Intro <- Branch
  Choice A
    Consequence A <- Branch
  Choice B
    Consequence B <- Branch
  ...
```

### Properties

Branches have several properties that can take strings or more branches or
references to other branches.

#### Quick Example

```javascript
Sweet.root = {
  tag: 'intro',
  text: 'You find yourself in a room with a window and a door.',
  choices: {
    'Look out the window': {
      text: 'You look out the window to see a bird in a tree.'
    },
    'Go through the door': {
      action: '#hallway'
    }
  }
};

Sweet.bundle = [
  {
    tag: 'hallway',
    text: "You're in a hallway with 4 doors on either side and a staircase at the end."
  }
];
```

#### Text

Adds text to the `narrative` area of the screen. Special `inserts` can be used
to populate values from objects and characters, allowing for more
customized gameplay. (see Inserts)

##### Basic Use
```javascript
{
  text: "Hello world!"
}
```

By default, new text will be in a paragraph of it's own. In order to continue
the previous paragraph, use `< ` at the start.
e.g. `"<It roared and the ground shook."`
For more than one paragraph use an array of strings.
e.g.
```javascript
{
  text: [
    "First paragraph",
    "Second paragraph"
  ]
}
```

#### Tag

Tags are used to move the story from one branch to another. Every game must have
at least one branch tagged `intro`.

##### Basic Use
```javascript
{
  tag: 'intro'
}
```

#### Choices

Choices guide the story from branch to branch.

##### Basic Use
```javascript
{
  choices: {
    "Do something": {
      // Another Branch...
    },
    "Do something else": {
      // Another Branch...
    }
  }
}
```

#### Condition

Conditions are criteria that must be met for the branch to be available as a choice. It can be a function that returns a binary value or a simple check on the inventory whether an item is in possession. e.g. `"has book"` or `"has no book"`.

##### Basic Use
```javascript
{
  choices: {
    "Do something": {
      condition: function() {
        return false;
      }
    },
    "Do something else": {
      condition: "has book"
    }
  }
}
```

#### Action

Actions are functions that are executed when the branch is reached. If a string is specified, it could move the narrative to a particular branch using a tag. e.g. `action: '#tagname'`. You can also remove or add an item from the inventory using the keywords `take` and `give` respectively. e.g. `action: 'take book'` or `action: 'give book'`.

##### Basic Use
```javascript
{
  action: function() {
    foo = "bar";
  }
}
```

## Bundle

The `bundle` is a collection of branches that don't fit within the main narrative tree and so must have tags to refer to them.

##### Basic Use
```javascript
Sweet.bundle = [
  {
    tag: 'one'
    // One Branch...
  },
  {
    tag: 'two'
    // Two Branch...
  }
]
```

## Inserts

Inserts are little bits of code in `text` that gets replaced with values from the main character, inventory and actions. This makes it easy to type a minimal amount for simple things such as, for example, pronouns for the main character.

##### Basic Use
```javascript

```
