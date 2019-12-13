import * as React from "react";

export interface SpatialNavigationConfig {
    activeClassName: string;
    focusableClassName: string;
    selector: string;
}

export default class SpatialNavigation extends React.Component<any, any> {
    new(props: any, context?: any)
}

export interface FocusableProps {
    active?: boolean;
    onFocus?: Function;
    className?: string;
    onUnfocus?: Function;
    onClickEnter?: Function;
    onWillUnfocus?: Function;
    onWillFocus?: Function;
}

export class Focusable<TFocusable = FocusableProps> extends React.Component<TFocusable> {
}

export enum Direction {
    LEFT = 'left',
    RIGHT = 'right',
    UP = 'up',
    DOWN = 'down'
}

interface IJsSpatialNavigation {
    /**
     * Disables the section with the specified sectionId temporarily. Elements defined in this section will become
     * unnavigable until enable() is called.
     * @param sectionId the section id
     */
    disable: (sectionId: string) => boolean;
    /**
     * Enables the section with the specified sectionId. Elements defined in this section, on which if disable()
     * was called earlier, will become navigable again.
     * @param sectionId the section id
     */
    enable: (sectionId: string) => boolean;
    /**
     * Makes SpatialNavigation pause until resume() is called. During its pause, SpatialNavigation stops to react
     * to key events and will not trigger any custom events.
     */
    pause: () => void;

    /**
     * Resumes SpatialNavigation, so it can react to key events and trigger events which paused because of pause().
     */
    resume: () => void;

    /**
     * Moves the focus to the given direction based on the rule of SpatialNavigation. The first element matching
     * selector is regarded as the origin. If selector is omitted, SpatialNavigation will move the focus based on
     * the currently focused element.
     * @param direction the move direction
     * @param selector the origin
     */
    move: (direction: Direction, selector?: string) => boolean

    /**
     * Focuses the section with the specified sectionId or the first element that matches selector.
     * If the first argument matches any of the existing sectionId, it will be regarded as a sectionId.
     *
     * Otherwise, it will be treated as selector instead. If omitted, the default section, which is set
     * by setDefaultSection(), will be the substitution.
     *
     * Setting silent to true lets you focus an element without triggering any custom events,
     * but note that it does not stop native focus and blur events.
     * @param selector String / Selector (without @ syntax)
     * @param silent enable/disable silet selection
     */
    focus: (selector?: string, silent?: boolean) => boolean
}

export const JsSpatialNavigation: IJsSpatialNavigation

export interface FocusableSectionProps {
    sectionId?: string;
    defaultElement?: any;
    enterTo: EnterTo;
}

export class FocusableSection<TFocusableSection = FocusableSectionProps> extends React.Component<TFocusableSection> {
    new(props: FocusableSectionProps)
}

export enum EnterTo {
    lastFocused = 'last-focused',
    default = 'default-element'
}

