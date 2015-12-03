// Story
Sweet.story([
	{
		tag: 'hallway',
		text: "You are in a hallway with a blue door on one end and a red door at the other.",
		choices: [
			{
				choice: 'You try the red door.',
				condition: 'has no key',
				action: '#hallway',
				text: "You try the red door and it does not budge."
			},
			{
				choice: 'You try the red door.',
				condition: 'has key',
				action: '#red-room',
				text: "You slip the key into the handle and it is able to turn. You enter the now unlocked door."
			}
		]
	},
	{
		tag: 'blue-room',
		text: "You find yourself in a room completely painted in blue with a white chest in the middle.",
		choices: [
			{
				
			}
		]
	},
	{
		tag: 'red-room',
		text: "You find yourself in a room completely painted in red with a white chest in the middle.",
		choices: [
			{
				choice: 'You open the chest',
				text: [
					"You open the chest to find the end of the game.",
					"THE END"
				]
			},
			{
				choice: 'You leave via the door you came in.',
				text: [
					
				]
			}
		]
	}
]);
