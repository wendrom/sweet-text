Sweet Text
==========

An engine that makes it easy to create CYOA (choose your own adventure) games
that can be played in a web browser!

Sorry if the info here seems incomplete. Not everything works yet.

# Usage

## Branch

Sweet Text uses 'Branch' objects to map out the text, actions and choices of the
game.

e.g.
```
First Branch
├── Choice A
│   ├── Branch A
│   ├── Choice A i
│   │   └── Branch A i
│   └── Choice A ii
│       └── Branch A ii
└── Choice B
    └── Branch
```

### Properties

Branches have several properties that can take strings or more branches or
references to other branches.

#### Quick Example

```javascript
Sweet.intro({
  text: 'You find yourself in a room with a window and a door.',
  choices: [
    {
      choice: 'Look out the window',
      text: 'You look out the window to see a bird in a tree.'
    },
    {
      choice: 'Go through the door',
      action: '#hallway'
    }
  ]
});

Sweet.story([
  {
    tag: 'hallway',
    text: "You're in a hallway with 4 doors on either side and a staircase at the end."
  }
]);
```

#### Text

Adds text to the `narrative` area of the screen. Special `inserts` can be used to populate values from objects and characters, allowing for more customized gameplay. (see Inserts)

##### Basic Use
```javascript
{
  text: "Hello world!"
}
```

By default, new text will be in a paragraph of it's own. In order to continue the previous paragraph, use `< ` at the start. e.g. `"<It roared and the ground shook."` For more than one paragraph use an array of strings.
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

Tags are used to move the story from one branch to another. So if a branch is tagged `hallway` then when another branch with the action `#hallway` is specified, it will move to the hallway branch. The tag `intro` is reserved for bringing the player to the beginning.

##### Basic Use
```javascript
{
  tag: 'hallway'
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
  choices: [
    {
      choice: "Do something",
      condition: function() {
        return false;
      }
    },
    {
      choice: "Do something else",
      condition: "has book"
    }
  ]
}
```

#### Action

Actions are functions that are executed when the branch is reached. You can also remove or add an item from the inventory using the keywords `take` and `give` respectively. e.g. `action: 'take book'` or `action: 'give book'`.

##### Basic Use
```javascript
{
  action: function() {
    foo = "bar";
  }
}
```

## Story

The `story` is a collection of branches that don't fit within the main narrative tree and so must have tags to refer to them.

##### Basic Use
```javascript
Sweet.story([
  {
    tag: 'one'
    // One Branch...
  },
  {
    tag: 'two'
    // Two Branch...
  }
]);
```

## Inserts

Inserts are little bits of code in `text` that gets replaced with values from the main character, inventory and actions. This makes it easy to type a minimal amount for simple things such as, for example, pronouns for the main character.

### General Inserts

Use insert tag `v{variableName}` to insert values stored in either `text` or in `choice` properties.

```javascript
// Branch
{
  text: "Here is a little example text that talks a little bit about your character. Your favorite color is c{favcolor}. You like to play c{favgame}."
}
// values
Sweet.values({
  favcolor = "blue",
  favgame = "Sweet Text"
});
```

### Inventory Inserts

Use insert tag `v{itemID|pass text|fail text}` to show text based whether or not the item is in the inventory or `v{itemID}` for the display name. The name of the item will only show if entered into the inventory.

```javascript
// Branch
{
  text: "You v{flashlight|have|do not have} a v{flashlight}!"
}
// Inventory
Sweet.inventory([
  {
    id: "flashlight",
    name: "red flashlight",
    description: "A red flashlight with a black button"
  }
]);
```

### Action Inserts

So long as the condition passes, the action of a branch will be executed and may return an object that can be used as inserts.
```javascript
// Branch
{
  action: function () {
    return {
      coin: Math.random() > 0.5
    };
  },
  text: "The coin flip resulted in a a{coin|heads|tails}!"
}
```
