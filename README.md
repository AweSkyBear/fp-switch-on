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
- pass `paths` (a case-to-function map) which returns a function (which accepts the `choice` or `case` to be evaluated)
- no default case
- use the return value of the final function if needed
- sweet TypeScript support
- API - 2 methods:
  - `switchOn` (alias of `basedOn`)
    - expects all paths to be satisfied, e.g. all choices to be present in the map, otherwise a TS error occurs **and** if we are passing a value dynamically (no static check), the function will error out if the value is not present
  - `switchOnPartial` (alias of `basedOnPartial`)
    - expects paths to be valid but not exhaustive (no error if only *some* of them are present in the map) **and** if we execute the final func with a path (`case`) not present in the map, then `undefined` is returned

See the examples below : ) 


## Usage Examples

Basic example:

```js
import { switchOn, switchOnPartial } from 'fp-switch-on'

const choice = 1

// prints 1
switchOn({
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
```

Basic TS example:

**Note:** remember that passing types is all optional.

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

A more realistic (better looking due to the type) example:

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

// or better (in some cases) - make it a function:
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
handlePlayerCommand('pause')

// or - if you are not providing all options as paths (`switchOnPartial`)
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

Example for using the return value

```ts
import { switchOn, switchOnPartial } from 'fp-switch-on'

const convertDigitToName = switchOn<number>({
  1: () => 'one',
  2: () => 'two',
  3: () => 'three'
})

// returns `one`
convertDigitToName(1)

// errors out - due to the path not satisfied (switchOn)
convertDigitToName(10)

// non-exhaustive: does not require the path to be satisfied (switchOnPartial)
const convertDigitToNameNoError = switchOnPartial<number>({
  1: () => 'one',
  2: () => 'two',
  3: () => 'three'
})

// returns `one`
convertDigitToNameNoError(1)

// returns `undefined` (no errors)
convertDigitToNameNoError(100)
```

Still wondering what's a good thing about paths mapping to functions (and not a raw value)?

Let's generate the path values dynamically:

```ts
import { switchOn, switchOnPartial } from 'fp-switch-on'

const digitNames = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
]

// let's generate the path-to-func map dynamically and use that
const convertDigitToName = switchOnPartial(digitNames.reduce((acc, val, ind) => {
  acc[ind] = () => val

  // results in a build-up of 
  // {
  //   0: () => 'zero',
  //   1: () => 'one',
  //   2: () => 'two'
  // }
  return acc
}, {}))
  
// returns `five`
convertDigitToName(5)

// returns `seven`
convertDigitToName(7)

// returns `three`
convertDigitToName(3)
```

Truth is, we can do even a bit more if needed, as the choice is passed to the path function!

Maybe we can decorate / transform / sanitize the final result a bit?

```ts
import { switchOn, switchOnPartial } from 'fp-switch-on'

const exclamateOnMyChoice = switchOnPartial<number>({
  3: (choice) => `My choice is ${choice} !!!`,
  5: (choice) => `My choice is ${choice} !!!`,
  7: (choice) => `My choice is ${choice} !!!`,
})
  
// returns `My choice is 5 !!!`
exclamateOnMyChoice(5)

// returns `My choice is 7 !!!`
exclamateOnMyChoice(7)

/// or cleaner, define a func - why repeat ourselves?
const exclamateChoice = (choice: number) => console.log(`My choice is ${choice} !!!`)

const exclamateOnMyChoice2 = switchOnPartial<number>({
  3: exclamateChoice,
  5: exclamateChoice,
  7: exclamateChoice,
})

  
// returns `My choice is 5 !!!`
exclamateOnMyChoice2(5)

// returns `My choice is 7 !!!`
exclamateOnMyChoice2(7)
```

And we can even pass and *type* more parameters for the final func if needed

```ts
import { switchOnPartial } from 'fp-switch-on'

type TOptions = {
  enhance: boolean
}

/// or cleaner - why repeat ourselves?
const exclamateChoice = (choice: number, opts?: TOptions) =>
  console.log(`My choice is ${choice} !!!`, opts.enhance && 'YES IT IS!!!')

const exclamateOnMyChoice2 = switchOnPartial<number, [TOptions]>({
  3: exclamateChoice,
  5: exclamateChoice,
  7: exclamateChoice,
})

// returns `My choice is 5 !!!`
exclamateOnMyChoice2(5, { enhance: false })

// returns `My choice is 7 !!! YES IT IS!!!`
exclamateOnMyChoice2(7, { enhance: true })
```

## Install

`npm install fp-switch-on`

## Thank You!

People underestimate the power of saying a simple *Thank You*. It's worth it.

I hope you find this little package useful! Enjoy!

