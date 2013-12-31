---
title: This title is from PAGE YFM (multiple.hbs)
description: This description is from PAGE YFM (multiple.hbs)
lead: This lead is from PAGE YFM (multiple.hbs)
quux: This property is from PAGE YFM (multiple.hbs)
---
# `explicit` context
Should be from `explicit.json`, then the YFM of the page, then the options, then the root.
{{include 'foo' explicit}}


# `page` context
Should be from the YFM of the page, then the options, then the root.
{{include 'foo' page}}


# `this` context
Should be from the YFM of the page, then the options, then the root.
{{include 'foo' this}}


# `data` context
Should be from the YFM of the include, `foo`, first; then fallback on `foo.json`, then the page, then the options, then the root.
{{include 'foo' data}}


# `foo` context
Should be from the YFM of the include, `foo`, first; then fallback on `foo.json`, then the page, then the options, then the root.
{{include 'foo' foo}}


# empty context
Should be from the YFM of the include, `foo`, first; then fallback on `foo.json`, then the page, then the options, then the root.
{{include 'foo'}}


# `bar` context (block)
Should be from the YFM of the include, `foo`, first; then fallback on `foo.json`, then fallback on `bar.json`, then the page, then the options, then the root.
{{#bar}}
  {{include 'foo'}}
{{/bar}}

# `parent` context (block)
Should use the context from the page.
{{#bar}}
  {{include 'foo' ../this}}
{{/bar}}

{{#bar}}
  {{include 'foo' ../page}}
{{/bar}}