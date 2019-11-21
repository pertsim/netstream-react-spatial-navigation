# react-js-spatial-navigation
A wrapper of js-spatial-navigation to react components

## Example
```javascript
import React from 'react';
import { render } from 'react-dom';
import SpatialNavigation, { Focusable, FocusableSection } from 'react-js-spatial-navigation'

function focus1() {
  console.log('focused 1')
}

function unfocus2() {
  console.log('unfocus 2')
}

const App = () => (
  <SpatialNavigation>
    <Focusable onFocus={focus1}>
      <p>Element 1</p>
    </Focusable>
    <Focusable onUnfocus={unfocus2}>
      <p>Element 2</p>
    </Focusable>

    <FocusableSection defaultElement="active">
      <Focusable>
        <p>Element 3</p>
      </Focusable>
      <Focusable className="active">
        <p>Element 4</p>
      </Focusable>
    </FocusableSection>
  </SpatialNavigation>
);

render(<App />, document.getElementById('root'));
```
[Live Example](https://codesandbox.io/s/ryn6450wrn)

## Documentation

### `<SpatialNavigation>`
This component initialize the Spatial Navigation library.
It should be used only one time and in the root node of the application.
The spatial navigation will only work within the Focusable components including the sections.

The spatial navigation can set a limited ammount of properties to configurate the spatial navigation behaviour

Configuration is a plain object with configurable properties.

#### `selector`

  + Type: [Selector](#selector-1)
  + Default: `''`

Elements matching `selector` are regarded as navigable elements in SpatialNavigation. However, hidden or disabled elements are ignored as they can not be focused in any way.

#### `straightOnly`

  + Type: Boolean
  + Default: `false`

When it is `true`, only elements in the straight (vertical or horizontal) direction will be navigated. i.e. SpatialNavigation ignores elements in the oblique directions.

#### `straightOverlapThreshold`

  + Type: Number in the range [0, 1]
  + Default: `0.5`

This threshold is used to determine whether an element is considered in the straight (vertical or horizontal) directions. Valid number is between 0 to 1.0.

Setting it to 0.3 means that an element is counted in the straight directions only if it overlaps the straight area at least 0.3x of its total area.

#### `rememberSource`

  + Type: Boolean
  + Default: `false`

When it is `true`, the previously focused element will have higher priority to be chosen as the next candidate.

#### `disabled`

  + Type: Boolean
  + Default: `false`

When it is `true`, elements defined in this section are unnavigable. This property is modified by [`disable()`](#spatialnavigationdisablesectionid) and [`enable()`](#spatialnavigationenablesectionid) as well.

#### `defaultElement`

  + Type: [Selector](#selector-1) (without @ syntax)
  + Default: `''`

When a section is specified to be the next focused target, e.g. [`focus('some-section-id')`](#spatialnavigationfocussectionidselector-silent) is called, the first element matching `defaultElement` within this section will be chosen first.

#### `enterTo`

  + Type: `''`, `'last-focused'` or `'default-element'`
  + Default: `''`

If the focus comes from another section, you can define which element in this section should be focused first.

`'last-focused'` indicates the last focused element before we left this section last time. If this section has never been focused yet, the default element (if any) will be chosen next.

`'default-element'` indicates the element defined in [`defaultElement`](#defaultelement).

`''` (empty string) implies following the original rule without any change.

#### `leaveFor`

  + Type: `null` or PlainObject
  + Default: `null`

This property specifies which element should be focused next when a user presses the corresponding arrow key and intends to leave the current section.

It should be a PlainObject consists of four properties: `'left'`, `'right'`, `'up'` and `'down'`. Each property should be a [Selector](#selector-1). Any of these properties can be omitted, and SpatialNavigation will follow the original rule to navigate.

**Note:** Assigning an empty string to any of these properties makes SpatialNavigation go nowhere at that direction.

#### `restrict`

  + Type: `'self-first'`, `'self-only'` or `'none'`
  + Default: `'self-first'`

`'self-first'` implies that elements within the same section will have higher priority to be chosen as the next candidate.

`'self-only'` implies that elements in the other sections will never be navigated by arrow keys. (However, you can always focus them by calling [`focus()`](#spatialnavigationfocussectionidselector-silent) manually.)

`'none'` implies no restriction.

#### `tabIndexIgnoreList`

  + Type: String
  + Default: `'a, input, select, textarea, button, iframe, [contentEditable=true]'`

Elements matching `tabIndexIgnoreList` will never be affected by [`makeFocusable()`](#spatialnavigationmakefocusablesectionid). It is usually used to ignore elements that are already focusable.

#### `navigableFilter`

  + Type: `'null'` or `function(HTMLElement)`
  + Default: `null`

A callback function that accepts a DOM element as the first argument.

SpatialNavigation calls this function every time when it tries to traverse every single candidate. You can ignore arbitrary elements by returning `false`.

### `<Focusable>`
A Focusable component that handle the onFocus, onUnfocus, onClickEnter events.
```
Props:
   onFocus: (optional)
     A function that will be fired when the component is focused.

   onUnfocus: (optional)
     A function that will be fired when the component is unfocused.

   onClickEnter: (optional)
     A function that will be fired when the component is focused and enter key is pressed.
```

### `<FocusableSection>`
A Focusable Section can specify a behaviour before focusing an element.
I.e. selecting a default element, the first element or an active one.

```
Props:
   defaultElement: (default: '')
     The default element that will be focused when entering this section.
     This can be:
       * a valid selector string for "querySelectorAll".
       * a NodeList or an array containing DOM elements.
       * a single DOM element.
       * an empty string.

   enterTo: (default: 'default-element')
     If the focus comes from another section, you can define which element in this section should be focused first.
     This can be:
       * 'last-focused' indicates the last focused element before we left this section last time. If this section has never been focused yet, the default element (if any) will be chosen next.
       * 'default-element' indicates the element defined in defaultElement.
       * an empty string.
```
