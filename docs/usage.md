With the helper registered, you may now begin using it in your templates:

```html
{{include 'foo'}}
```

Optionally pass in a context as the second parameter:

```html
{{include 'foo' bar}}
```

### Wildcard patterns

Globbing patterns may also be used:

```html
{{include 'chapter-*' bar}}
```
