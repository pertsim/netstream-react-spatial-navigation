import React, { Component } from 'react';
import PropTypes from 'prop-types';

import JsSpatialNavigation from './lib/spatial_navigation.js';

const defaultConfig = {
  activeClassName: 'active',
  focusableClassName: 'focusable',
  selector: '.focusable',
};
let config = {};

/**
* This component initialize the Spatial Navigation library.
* It should be used only one time and in the root node of the application.
* The spatial navigation only work within the Focusable components.
*/
class SpatialNavigation extends Component {

  getConfigFromProps() {
    let propsConfig = {};

    // React Custom: Set activeClassName
    if (typeof this.props.activeClassName === 'string') {
      propsConfig.activeClassName = this.props.activeClassName;
    }

    // React Custom: Set focusableClassName
    if (typeof this.props.focusableClassName === 'string') {
      propsConfig.focusableClassName = this.props.focusableClassName;
    }

    // React Custom: Set customInit
    if (typeof this.props.customInit === 'function') {
      propsConfig.customInit = this.props.customInit;
    }

    // Set defaultElement
    if (typeof this.props.defaultElement === 'string') {
      propsConfig.defaultElement = this.props.defaultElement;
    }

    // Set disabled
    if (typeof this.props.disabled === 'boolean') {
      propsConfig.disabled = this.props.disabled;
    }

    // Set enterTo
    if (typeof this.props.enterTo === 'string') {
      propsConfig.enterTo = this.props.enterTo;
    }

    // Set leaveFor
    if (typeof this.props.leaveFor === 'object') {
      propsConfig.leaveFor = this.props.leaveFor;
    }

    // Set navigableFilter
    if (typeof this.props.navigableFilter === 'function') {
      propsConfig.navigableFilter = this.props.navigableFilter;
    }

    // Set rememberSource
    if (typeof this.props.rememberSource === 'string') {
      propsConfig.rememberSource = this.props.rememberSource;
    }

    // Set restrict
    if (typeof this.props.restrict === 'string') {
      propsConfig.restrict = this.props.restrict;
    }

    // Set selector
    if (typeof this.props.selector === 'string') {
      propsConfig.selector = this.props.selector;
    }

    // Set straightOnly
    if (typeof this.props.straightOnly === 'boolean') {
      propsConfig.straightOnly = this.props.straightOnly;
    }

    // Set straightOverlapThreshold
    if (typeof this.props.straightOverlapThreshold === 'number') {
      propsConfig.straightOverlapThreshold = this.props.straightOverlapThreshold;
    }

    // Set tabIndexIgnoreList
    if (typeof this.props.tabIndexIgnoreList === 'string') {
      propsConfig.tabIndexIgnoreList = this.props.tabIndexIgnoreList;
    }

    return propsConfig;
  }

  componentDidMount() {
    config = Object.assign(defaultConfig, this.getConfigFromProps.call(this));

    if (!this.props.customInit) {
      JsSpatialNavigation.init();
      JsSpatialNavigation.add(config);
      JsSpatialNavigation.focus();

    } else {
      this.props.customInit.call(this, config);
    }
  }

  componentWillUnmount() {
    JsSpatialNavigation.uninit();
  }

  render() {
    let classNames = [];

    if (this.props.className) {
      classNames.push(this.props.className);
    }

    return (
      <div className={classNames.join(" ")}>{this.props.children}</div>
    );
  }
}

function getSelector(id) {
  return `.${id}`;
}

/**
* A Focusable component that handle the onFocus, onUnfocus, onClickEnter events.
*
* Props:
*   onFocus: (optional)
*     A function that will be fired when the component is focused.
*
*   onUnfocus: (optional)
*     A function that will be fired when the component is unfocused.
*
*   onClickEnter: (optional)
*     A function that will be fired when the component is focused and enter key is pressed.
*/
class Focusable extends Component {
  createHandler(handlerName) {
    return (e) => {
      const handler = this.props[handlerName];

      if (handler) {
        return handler(e);
      }
    }
  }

  handleWillUnfocus = this.createHandler('onWillUnfocus')
  handleWillFocus = this.createHandler('onWillFocus')
  handleFocused = this.createHandler('onFocus')
  handleUnfocused = this.createHandler('onUnfocus')
  handleClickEnter = this.createHandler('onClickEnter')

  componentDidMount() {
    if (!this.el) { return; }

    this.el.addEventListener("sn:willunfocus", this.handleWillUnfocus);
    this.el.addEventListener("sn:willfocus", this.handleWillFocus);
    this.el.addEventListener("sn:focused", this.handleFocused);
    this.el.addEventListener("sn:unfocused", this.handleUnfocused);
    this.el.addEventListener("sn:enter-up", this.handleClickEnter);
  }

  componentWillUnmount() {
    this.el.removeEventListener("sn:willunfocus", this.handleWillUnfocus);
    this.el.removeEventListener("sn:willfocus", this.handleWillFocus);
    this.el.removeEventListener("sn:focused", this.handleFocused);
    this.el.removeEventListener("sn:unfocused", this.handleUnfocused);
    this.el.removeEventListener("sn:enter-up", this.handleClickEnter);
  }

  ref = (el) => {
    this.el = el;
  }

  render() {
    let classNames = [this.context.focusableSectionId ? this.context.focusableSectionId : config.focusableClassName];

    const {
      active,
      onFocus,
      children,
      className,
      onUnfocus,
      onClickEnter,
      onWillUnfocus,
      onWillFocus,
      ...rest
    } = this.props

    if (active) {
      classNames.push(config.activeClassName);
    }

    if (className) {
      classNames.push(className);
    }

    return (
      <div {...rest} className={classNames.join(" ")} ref={this.ref} tabIndex="-1">
        {children}
      </div>
    );
  }
}

Focusable.contextTypes = {
  focusableSectionId: PropTypes.string,
  onClickEnter: PropTypes.func,
  onUnfocus: PropTypes.func,
  onFocus: PropTypes.func
};

/*
* A Focusable Section can specify a behaviour before focusing an element.
* I.e. selecting a default element, the first element or an active one.
*
* Props:
*   defaultElement: (default: '')
*     The default element that will be focused when entering this section.
*     This can be:
*       * a valid selector string for "querySelectorAll".
*       * a NodeList or an array containing DOM elements.
*       * a single DOM element.
*       * an empty string.
*
*   enterTo: (default: 'default-element')
*     If the focus comes from another section, you can define which element in this section should be focused first.
*     This can be:
*       * 'last-focused' indicates the last focused element before we left this section last time. If this section has never been focused yet, the default element (if any) will be chosen next.
*       * 'default-element' indicates the element defined in defaultElement.
*       * an empty string.
*/
class FocusableSection extends Component {
  sectionId = JsSpatialNavigation.add(this.props.sectionId, {});

  createHandler(handlerName) {
    return (e) => {
      const handler = this.props[handlerName];

      if (handler) {
        return handler(e);
      }
    }
  }

  handleWillUnfocus = this.createHandler('onWillUnfocus')
  handleWillFocus = this.createHandler('onWillFocus')

  getChildContext() {
    return {focusableSectionId: this.sectionId};
  }

  componentWillUnmount() {
    JsSpatialNavigation.remove(this.sectionId);

    this.el.removeEventListener("sn:willunfocus", this.handleWillUnfocus);
    this.el.removeEventListener("sn:willfocus", this.handleWillFocus);
  }

  _getSelector() {
    return getSelector(this.sectionId);
  }

  componentDidMount() {
    let defaultElement = this.props.defaultElement;
    const enterTo = this.props.enterTo === undefined ? 'default-element' : this.props.enterTo;

    if (defaultElement && defaultElement === 'first') {
      defaultElement = this._getSelector() + ':first-child';
    }

    if (defaultElement && defaultElement === 'active') {
      defaultElement = this._getSelector() + `.${config.activeClassName}`;
    }

    JsSpatialNavigation.set(this.sectionId, {
      selector: this._getSelector(),
      enterTo: enterTo,
      defaultElement: defaultElement
    });

    if (!this.el) { return; }

    this.el.addEventListener("sn:willunfocus", this.handleWillUnfocus);
    this.el.addEventListener("sn:willfocus", this.handleWillFocus);
  }

  ref = (el) => {
    this.el = el;
    if (this.props.containerRef) {
      this.props.containerRef(el);
    }
  }

  render() {
    let classNames = [];

    const {
      children,
      className,
      containerRef,
      sectionId,
      defaultElement,
      onWillUnfocus,
      onWillFocus,
      enterTo,
      ...rest
    } = this.props

    if (className) {
      classNames.push(className);
    }

    return (
      <div ref={this.ref} {...rest} className={classNames.join(" ")}>
        {children}
      </div>
    );
  }
}

FocusableSection.propTypes = {
  containerRef: PropTypes.func,
  sectionId: PropTypes.string
};

FocusableSection.childContextTypes = {
  focusableSectionId: PropTypes.string
};


export { SpatialNavigation as default, FocusableSection, Focusable, JsSpatialNavigation };
