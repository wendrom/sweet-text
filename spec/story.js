// Story
Sweet.story([
	{
		tag: 'foo',
		text: "<foo v{foo}",
		choices: [
			{
				choice: 'foo? v{foobar|yay|nay}',
				tag: 'foo-foo',
				next: 'foo',
				text: [
					"foo-foo! v{foobar|y|n}",
					'"Here is another v{foobar|paragraph|thing}!" he says.',
					"<And another one that continues the last one!"
				]
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
				text: "bar-foo! v{foobar|multiple success words|and some more failure words}"
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
