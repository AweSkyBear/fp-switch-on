# fp-switch-on

A functional, much better alternative to the `switch` statement.

Clean, elegant, type-checked. What more do you need?

## Why?

Because:
- you don't want the fallthrough logic
- the functional nature of JavaScript suits well the existence of such function
- you probably don't want a `default` case
- it has TypeScript support and checks stuff nicely

## Features
- pass `paths` (a case-to-function map) which returns a function (which accepts the `choice`)
- no default case
- sweet TypeScript support
- 2 methods:
  - `switchOn` (alias of `basedOn`)
    - expects all paths to be satisfied, e.g. all choices to be present in the map, otherwise a TS error occurs
  - `switchOnPartial` (alias of `basedOnPartial`)
    - expects paths to be valid but not exhausted (no error if only *some* of them are present in the map)


## Usage Examples

Basic example:

```ts
import { switchOn, switchOnPartial } from 'fp-switch-on'

const choice = 1

// prints 1
switchOn<1 | 2 | 3>({
  1: () => {
    console.log('1')
  },
  2: () => {
    console.log('2')
  },
  3: () => {
    console.log('3')
  }
})(choice)

// prints 2 - switchOnPartial does not require all paths to be present
switchOnPartial<1 | 2 | 3 | 4 | 5 | 6>({
  1: () => {
    console.log('1')
  },
  2: () => {
    console.log('2')
  }
})(2)

```

A more realistic example:

```ts
import { switchOn, switchOnPartial } from 'fp-switch-on'

type TCommand = 'start' | 'pause' | 'resume' | 'stop'

switchOn<TCommand>({
  start: () => {
    console.log('start')
  },
  pause: () => {
    console.log('pause')
  },
  resume: () => {
    console.log('resume')
  },
  stop: () => {
    console.log('stop')
  },
})('start')

// or better - make it a function:
const handlePlayerCommand = switchOn<TCommand>({
  start: () => {
    console.log('start command')
  },
  pause: () => {
    console.log('pause command')
  },
  resume: () => {
    console.log('resume command')
  },
  stop: () => {
    console.log('stop command')
  },
})

// prints `pause command`
handlePlayerCommand('pause command')

// or - if you are not providing all options -
const handlePlayerCommand2 = switchOnPartial<TCommand>({
  start: () => {
    console.log('start command !')
  },
  resume: () => {
    console.log('resume command !')
  },
})

// prints `start command !`
handlePlayerCommand2('start')
```

## Install

`npm install fp-switch-on`
