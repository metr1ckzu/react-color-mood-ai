import React from 'react';

import {
  TimelineMax,
  TweenMax,
  Linear,
  Sine
} from 'gsap'

import { findDOMNode } from 'react-dom';

const animationStates = {
    beforeEnter: { y: 100, scale: 1.6, opacity: 0 },
    idle: { y: 0, scale: 1, opacity: 1 },
    afterLeave: { y: -100, scale: 0.7, opacity: 0 },
  }

export default class Animates extends React.Component {

  static animationStates = animationStates;

  componentDidMount() {
    const el = findDOMNode(this);

    this.timeline = new TimelineMax()
      .pause()
      .add(TweenMax.to(el, 1, Object.assign({}, Animates.animationStates.beforeEnter, {ease: Linear.easeNone})))
      .add('beforeEnter')
      .add(TweenMax.to(el, 1, Object.assign({}, Animates.animationStates.idle, {ease: Linear.easeNone})))
      .add('idle')
      .add(TweenMax.to(el, 1, Object.assign({}, Animates.animationStates.afterLeave, {ease: Linear.easeNone})))
      .add('afterLeave')

    this.timeline.seek('beforeEnter');
  }

  componentWillAppear(callback) {
    this.timeline.seek('idle');
    callback();
  }

  componentWillEnter(callback) {
    const el = findDOMNode(this);

    this.timeline.seek('beforeEnter');
    TweenMax.killTweensOf(this.timeline);
    TweenMax.to(this.timeline, this.props.enterDuration, { time: this.timeline.getLabelTime('idle'), onComplete: callback, ease: Sine.easeOut });
  }

  componentWillLeave(callback) {
    const className = this.props.className;
    this.timeline.pause();
    TweenMax.killTweensOf(this.timeline);
    TweenMax.to(this.timeline, this.props.leaveDuration, { time: this.timeline.getLabelTime('afterLeave'), onComplete: callback, ease: Sine.easeIn });
  }

  render() {
    return this.props.component
  }

}