// Story
Sweet.story([
	{
		tag: 'foo',
		text: "foo v{foo}",
		choices: [
			{
				choice: 'foo? v{foobar|yay|nay}',
				tag: 'foo-foo',
				next: 'foo',
				text: "foo-foo! v{foobar|y|n}"
			},
			{
				choice: 'bar? v{foobar}',
				tag: 'foo-bar',
				next: 'bar',
				text: "foo-bar! v{foobar}"
			},
			{
				choice: 'foobar?',
				tag: 'foo-foobar',
				condition: 'has no foobar',
				action: 'give foobar',
				next: 'foo',
				text: "foobar!"
			}
		]
	},
	{
		tag: 'bar',
		text: "bar v{bar}",
		choices: [
			{
				choice: 'foo?',
				tag: 'bar-foo',
				next: 'foo',
				text: "bar-foo! v{foobar|y|n}"
			},
			{
				choice: 'bar?',
				tag: 'bar-bar',
				next: 'bar',
				text: "bar-bar! v{foobar}"
			}
		]
	}
]);
