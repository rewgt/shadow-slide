'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// slides.js

var React = require('react'); // var React = window.React;
var ReactDOM = require('react-dom'); // var ReactDOM = window.ReactDOM;
var W = require('shadow-widget'); // var W = window.W;
// if (!React || !ReactDOM || !W) console.log('fatal error: invalid cdn version of react or shadow-widget.');
var T = W.$templates,
    creator = W.$creator;
var utils = W.$utils,
    ex = W.$ex,
    main = W.$main;

var containNode_ = null;
var topmostWidget_ = null;

var widgetBaseUrl_ = '/app/rewgt/shadow-slide/web/output';

var TGotoPage_ = function (_T$Div_) {
  _inherits(TGotoPage_, _T$Div_);

  function TGotoPage_(name, desc) {
    _classCallCheck(this, TGotoPage_);

    var _this = _possibleConstructorReturn(this, (TGotoPage_.__proto__ || Object.getPrototypeOf(TGotoPage_)).call(this, name || 'rewgt.GotoPage', desc));

    _this._defaultProp['step.play'] = true;
    // this._docUrl = 'doc';  // default is 'doc'
    return _this;
  }

  _createClass(TGotoPage_, [{
    key: '_getGroupOpt',
    value: function _getGroupOpt(self) {
      return { type: 'mono', // mono, extend
        editable: 'all', // all, some, none
        baseUrl: widgetBaseUrl_,
        tools: []
      };
    }
  }, {
    key: '_getSchema',
    value: function _getSchema(self, iLevel) {
      iLevel = iLevel || 1200;
      var schema = _get(TGotoPage_.prototype.__proto__ || Object.getPrototypeOf(TGotoPage_.prototype), '_getSchema', this).call(this, self, iLevel + 200);
      schema['data-goto'] = [iLevel + 1, 'string', null, '[string]: +N, -N, N, or named_page'];
      return schema;
    }
  }, {
    key: 'getDefaultProps',
    value: function getDefaultProps() {
      var props = _get(TGotoPage_.prototype.__proto__ || Object.getPrototypeOf(TGotoPage_.prototype), 'getDefaultProps', this).call(this);
      props['step.play'] = true;
      props['data-goto'] = '+1'; // data-* auto used as _statedProp
      props['html.'] = 'GotoPage';
      return props;
    }
  }, {
    key: 'stepPlay',
    value: function stepPlay(iSpeed) {
      // ignore iSpeed
      if (W.__design__) return;

      var self = this;
      setTimeout(function () {
        var goNext = false,
            goPrev = false;
        var sPage = self.state['data-goto'] || '';
        if (sPage[0] == '+') {
          goNext = true;
          sPage = sPage.slice(1);
        } else if (sPage[0] == '-') {
          goPrev = true;
          sPage = sPage.slice(1);
        }
        var iPage = parseInt(sPage);
        if (isNaN(iPage) && !goNext && !goPrev) iPage = utils.pageCtrl.namedPage[sPage];
        if (isNaN(iPage)) return; // goto unknown place

        var iNewPage = utils.pageCtrl.pageIndex;
        iNewPage = goNext ? iNewPage + iPage : goPrev ? iNewPage - iPage : iPage;
        utils.pageCtrl.gotoPage(iNewPage);
      }, 300);
    }
  }, {
    key: 'stepPause',
    value: function stepPause(sReason) {
      // do nothing
    }
  }, {
    key: 'stepIsDone',
    value: function stepIsDone() {
      return true;
    }
  }, {
    key: 'playOnEnter',
    value: function playOnEnter() {
      return false;
    }
  }, {
    key: '$onClick',
    value: function $onClick(event) {
      if (W.__design__) return;
      if (utils.hasClass(this, 'hidden-default')) return;

      var node = this.getHtmlNode(),
          targ = event.target,
          sGoto = '';
      while (targ) {
        sGoto = targ.getAttribute('data-goto') || '';
        if (sGoto) break;
        if (targ === node || targ === document) break;else targ = targ.parentNode;
      }
      if (!sGoto) return;

      if (node !== targ) this.duals['data-goto'] = sGoto;
      // else, read 'data-goto' from self node
      this.stepPlay(0); // will delay 300 ms
    }
  }]);

  return TGotoPage_;
}(T.Div_);

if (!T.rewgt) T.rewgt = {};
T.rewgt.GotoPage_ = TGotoPage_;
T.rewgt.GotoPage = new TGotoPage_();

var TDelayTimer_ = function (_T$P_) {
  _inherits(TDelayTimer_, _T$P_);

  function TDelayTimer_(name, desc) {
    _classCallCheck(this, TDelayTimer_);

    var _this2 = _possibleConstructorReturn(this, (TDelayTimer_.__proto__ || Object.getPrototypeOf(TDelayTimer_)).call(this, name || 'rewgt.DelayTimer', desc));

    _this2._defaultProp['step.play'] = true;
    // this._docUrl = 'doc';  // default is 'doc'
    return _this2;
  }

  _createClass(TDelayTimer_, [{
    key: '_getGroupOpt',
    value: function _getGroupOpt(self) {
      return { type: 'mono',
        editable: 'all',
        baseUrl: widgetBaseUrl_,
        tools: []
      };
    }
  }, {
    key: '_getSchema',
    value: function _getSchema(self, iLevel) {
      iLevel = iLevel || 1200;
      var schema = _get(TDelayTimer_.prototype.__proto__ || Object.getPrototypeOf(TDelayTimer_.prototype), '_getSchema', this).call(this, self, iLevel + 200);
      schema['data-delay'] = [iLevel + 1, 'string', null, '[string]: 0 or N seconds'];
      schema['data-auto'] = [iLevel + 2, 'string', null, '[string]: auto delay when page enter, "" or "1"'];
      return schema;
    }
  }, {
    key: 'getDefaultProps',
    value: function getDefaultProps() {
      var props = _get(TDelayTimer_.prototype.__proto__ || Object.getPrototypeOf(TDelayTimer_.prototype), 'getDefaultProps', this).call(this);
      props['step.play'] = true;
      props['data-delay'] = '0';
      props['data-auto'] = '';
      return props;
    }
  }, {
    key: 'getInitialState',
    value: function getInitialState() {
      var state = _get(TDelayTimer_.prototype.__proto__ || Object.getPrototypeOf(TDelayTimer_.prototype), 'getInitialState', this).call(this);
      this.canAct = true;
      this.isDone = false;
      return state;
    }
  }, {
    key: 'stepPlay',
    value: function stepPlay(iSpeed) {
      if (W.__design__) return;

      var iSecond = parseInt(this.state['data-delay']) || 0;
      if (iSecond === 0) iSecond = iSpeed || 0;
      if (isNaN(iSecond)) return; // ignore

      this.canAct = true;
      this.isDone = false;
      var self = this;

      setTimeout(function () {
        self.isDone = true;

        var node,
            evt,
            canAct = self.canAct;
        if (canAct && self.$onClick && (node = self.getHtmlNode())) {
          if (window.getComputedStyle(node).visibility != 'hidden') {
            evt = document.createEvent('Event');
            evt.target = node;
            self.$onClick(evt);
          }
        }

        if (canAct && Array.isArray(self.state.trigger)) utils.fireTrigger(self);
      }, iSecond * 1000);
    }
  }, {
    key: 'stepPause',
    value: function stepPause(sReason) {
      this.canAct = false;
    }
  }, {
    key: 'stepIsDone',
    value: function stepIsDone() {
      return this.isDone;
    }
  }, {
    key: 'playOnEnter',
    value: function playOnEnter() {
      var s = this.state['data-auto'];
      if (s == 'true') return true;
      return !!parseInt(s);
    }
  }]);

  return TDelayTimer_;
}(T.P_);

T.rewgt.DelayTimer_ = TDelayTimer_;
T.rewgt.DelayTimer = new TDelayTimer_();

//---------------------------
var TRANS_END_FUNC = '';
var TRANS_CSS_NAME = '';

var SLIDE_HALF_WIDTH = 450;
var SLIDE_HALF_HEIGHT = 350;
var SLIDE_GAP_WIDTH = 100;
var SCREEN_CENTER_X = Math.floor(window.innerWidth / 2);
var SCREEN_CENTER_Y = Math.floor(window.innerHeight / 2);

var slideState = 0; // 0:init, else started
var slideEls = [];
var slideHiter = {};

var last_prepost_ = null; // node
var last_step_player_ = null; // component

var array_push_ = Array.prototype.push;
var default_margin_ = [0, 0, 0, 0];
var remove_pre_cls_ = ['-prebuild-1', '-prebuild-2', '-prebuild-3', '-prebuild-4', '-prebuild-5'];

var waitResetComps_ = [];
var prepare_loopback_ = true;

function getUrlParam(s) {
  var dRet = {},
      b = s.split('&');
  b.forEach(function (item) {
    if (!item) return;
    var b2 = item.split('='),
        sName = b2[0].trim();
    if (sName) dRet[sName] = (b2[1] || '').trim();
  });
  return dRet;
}

function makeConfig() {
  var cfg = getUrlParam(window.location.search.slice(1));
  var bRmv = [],
      hyphenPattern = /-(.)/g;

  Object.keys(cfg).forEach(function (sKey) {
    var value = cfg[sKey];
    var sKey2 = sKey.replace(hyphenPattern, function (_, chr) {
      return chr.toUpperCase();
    });
    if (sKey != sKey2) {
      bRmv.push(sKey);
      sKey = sKey2;
    }

    if (value) {
      value = decodeURIComponent(value);
      if (value.length <= 48) {
        var f = parseFloat(value);
        if (typeof f == 'number' && f + '' === value) cfg[sKey] = f;else cfg[sKey] = value;
      } else cfg[sKey] = value;
    } else cfg[sKey] = 1; // &no-frame&no-ground  --> noFrame=1, noGround=1
  });

  bRmv.forEach(function (sKey) {
    delete cfg[sKey];
  });
  return cfg;
}

function checkJoinedStep(slideNode) {
  if (!slideNode.parentNode) return; // invalid

  var block = slideNode.querySelector('div.rewgt-center > [class*="prebuild-"]');
  if (block) {
    var s = block.getAttribute('data-prepost') || '';
    var b = s.split('-');
    if (b.length >= 5 && parseInt(b[4])) // exist joined step
      setupFrames_(utils.pageCtrl, utils.pageCtrl.pageIndex, true);
  }
}

function setupFrames_(pageCtrl, iCurr, withStepNext) {
  if (!pageCtrl.keys.length) return; // not ready yet

  if (last_step_player_) {
    var slideWdgt,
        wdgt = last_step_player_.widget,
        stepDone = false;
    if (wdgt && (slideWdgt = wdgt.parent)) {
      // still avaliable
      if (typeof last_step_player_.stepIsDone == 'function') {
        if (last_step_player_.stepIsDone()) {
          stepDone = true;
          last_step_player_ = null;
        }
      } else last_step_player_ = null;
    } else last_step_player_ = null;

    if (last_step_player_) {
      setTimeout(function () {
        setupFrames_(pageCtrl, iCurr, withStepNext);
      }, 600); // check again after 0.6 second
      return;
    }

    if (stepDone) {
      var slideComp = slideWdgt.component,
          slideNode = slideComp && slideComp.getHtmlNode();
      if (slideNode) checkJoinedStep(slideNode);
    }
    return;
  }

  SCREEN_CENTER_Y = Math.floor(window.innerHeight / 2);
  var topY = SCREEN_CENTER_Y - SLIDE_HALF_HEIGHT;
  var lastPgIndex = pageCtrl.pageIndex;

  var isFirstTime = false;
  if (slideState == 0) {
    isFirstTime = true;
    lastPgIndex = -1;

    slideState = 1;
    slideEls = [];

    containNode_.classList.add('no-trans'); // ignore first time transition
    setTimeout(function () {
      containNode_.classList.remove('no-trans');
    }, 1200);

    var wd = SLIDE_HALF_WIDTH + SLIDE_HALF_WIDTH;
    var hi = SLIDE_HALF_HEIGHT + SLIDE_HALF_HEIGHT;

    // scan slideEls, ensure component exists
    var keys = [],
        namedPage = {};
    pageCtrl.keys.forEach(function (sKey) {
      var comp = topmostWidget_[sKey];
      if (comp && (comp = comp.component)) {
        var sName = comp.props.name;
        if (sName && typeof sName == 'string') namedPage[sName] = slideEls.length;
        slideEls.push(comp);
        keys.push(sKey);
      }
    });
    pageCtrl.keys = keys;
    pageCtrl.namedPage = namedPage;

    var bChild = [];
    slideEls.forEach(function (comp, idx) {
      var b = pageCtrl.initPage(comp, keys[idx], idx, wd, hi, topY);
      array_push_.apply(bChild, b);
    });
    setTimeout(function () {
      bChild.forEach(function (item) {
        utils.addClass(item[0], item[1]); // delay add prebuild-N
      });
    }, 1000);
  } else slideState += 1;

  var tp = typeof iCurr === 'undefined' ? 'undefined' : _typeof(iCurr);
  if (tp == 'string') {
    var iTmp = parseInt(iCurr);
    if (iTmp + '' == iCurr) {
      iCurr = iTmp;
      tp = 'number';
    } else {
      iCurr = pageCtrl.namedPage[iCurr];
      tp = typeof iCurr === 'undefined' ? 'undefined' : _typeof(iCurr);
    }
  }

  if (tp != 'number') return;
  var iLen = pageCtrl.keys.length;
  if (!iLen) return;
  if (iCurr >= iLen) iCurr = iLen - 1;
  if (iCurr < 0) iCurr = 0;
  if (iCurr === lastPgIndex && !withStepNext) return; // no need change page

  if (withStepNext && lastPgIndex >= 0) {
    // try step next, must not first time
    var slideComp = slideEls[lastPgIndex];
    if (slideComp) {
      var toLeave = !slideComp.whenSlideLeave(); // slideComp.whenSlideLeave must exist
      if (toLeave) {
        // step is hit
        if (last_prepost_ && last_step_player_) {
          setTimeout(function () {
            setupFrames_(pageCtrl, iCurr, withStepNext); // wait checking step finish or not
          }, 300);
        }
        return;
      }
    }
  }

  if (isFirstTime) {
    setTimeout(function () {
      dispatchEnter();
    }, 0); // wait for prepare pre-post finished
  } else dispatchEnter();

  function dispatchEnter() {
    var curr = SCREEN_CENTER_X - SLIDE_HALF_WIDTH;
    var next1 = SCREEN_CENTER_X + SLIDE_HALF_WIDTH + SLIDE_GAP_WIDTH;
    var next2 = next1 + SLIDE_HALF_WIDTH + SLIDE_HALF_WIDTH + SLIDE_GAP_WIDTH;
    var prev1 = curr - SLIDE_HALF_WIDTH - SLIDE_HALF_WIDTH - SLIDE_GAP_WIDTH;
    var prev2 = prev1 - SLIDE_HALF_WIDTH - SLIDE_HALF_WIDTH - SLIDE_GAP_WIDTH;

    var node,
        currComp = null,
        currKey = '';
    slideEls.forEach(function (comp, iPage) {
      var hideIt = false;
      comp.duals.top = topY;
      if (iPage <= iCurr) {
        if (iPage == iCurr) {
          comp.duals.left = curr;
          currComp = comp;
          currKey = pageCtrl.keys[iCurr];
        } else if (iPage == iCurr - 1) comp.duals.left = prev1;else if (iPage == iCurr - 2) comp.duals.left = prev2;else hideIt = true;
      } else if (iPage == iCurr + 1) comp.duals.left = next1;else if (iPage == iCurr + 2) comp.duals.left = next2;else hideIt = true;

      if (hideIt) {
        comp.duals.left = curr;
        if (comp.state.style.display != 'none') comp.duals.style = { display: 'none' };
      } else {
        if (comp.state.style.display != 'block') comp.duals.style = { display: 'block' };
      }
    });
    if (!currComp || !currKey) return;

    pageCtrl.pageIndex = iCurr; // save it only when it is changed
    var node = currComp.getHtmlNode();
    if (!node) return;

    var evt = document.createEvent('Event');
    evt.initEvent('slideenter', true, true);
    evt.pageKey = currKey;
    evt.pageIndex = iCurr;
    node.dispatchEvent(evt);

    setTimeout(function () {
      var prevented = false;
      if (typeof evt.isDefaultPrevented == 'function') // maybe wrapped by jQuery
        prevented = evt.isDefaultPrevented();else prevented = !!evt.defaultPrevented;

      if (!prevented) {
        var iNum = (slideHiter[currKey] || 0) + 1;
        slideHiter[currKey] = iNum;
        if (isFirstTime) {
          setTimeout(function () {
            pageCtrl.enterPage(evt, currComp, iNum == 1);
          }, 1000); // waiting for prebuild-N ready
        } else pageCtrl.enterPage(evt, currComp, iNum == 1);
      }
    }, 0);
  }
}

main.$onLoad.push(function () {
  // all functions in $onLoad not run when W.__design__
  containNode_ = creator.containNode_; // must be exists
  topmostWidget_ = creator.topmostWidget_; // must be exists
  if (!containNode_ || !topmostWidget_) return;

  var pageCtrl = utils.pageCtrl;
  if (!pageCtrl) {
    // no ScenePage defined, create empty one
    if (W.__design__) return; // double check for safty
    pageCtrl = utils.pageCtrl = new creator.pageCtrl_([]);
  }

  var vendor = utils.vendorId || [],
      sVendor = vendor[0] || '';
  if (sVendor == 'ie') {
    TRANS_END_FUNC = 'MSTransitionEnd';
    if (vendor[1]) TRANS_CSS_NAME = 'transform'; // 'transform' and 'msTransform' both can work
    else {
        TRANS_CSS_NAME = 'msTransform';
        console.log('!warning: IE version too low, please use IE11 or higher');
      }
  } else if (sVendor == 'firefox') {
    TRANS_END_FUNC = 'transitionend';
    TRANS_CSS_NAME = 'transform';
  } else if (sVendor == 'opera') {
    TRANS_END_FUNC = 'oTransitionEnd';
    TRANS_CSS_NAME = 'transform';
  } else if (sVendor == 'chrome' || sVendor == 'safari' || sVendor == 'webkit') {
    TRANS_END_FUNC = 'webkitTransitionEnd';
    TRANS_CSS_NAME = 'WebkitTransform';
  } else // only support firefox/chrome/safari/opera/IE
    console.log('!fatal error: unknown web browser type');

  var config,
      withStepNext = false;
  var leftCtrl = pageCtrl.leftPanel,
      rightCtrl = pageCtrl.rightPanel;

  if (leftCtrl && rightCtrl && pageCtrl.gotoPage_) {
    // can replace
    config = makeConfig();
    if (pageCtrl.config) config = Object.assign({}, pageCtrl.config, config);
    pageCtrl.config = config;

    if (!pageCtrl.keys.length) {
      // config.noSidebar = true;
      // config.noKeypress = true;
      config.autoplay = false; // slide page maybe defined later, cancel autoplay when current is empty
    }

    leftCtrl.onclick = function (event) {
      withStepNext = false;
      pageCtrl.prevPage();
    };
    rightCtrl.onclick = function (event) {
      withStepNext = true;
      pageCtrl.nextPage();
    };

    leftCtrl.classList.add('wdgt-pgctrl');
    leftCtrl.classList.add('left');
    rightCtrl.classList.add('wdgt-pgctrl');
    rightCtrl.classList.add('right');
    leftCtrl.style.opacity = '0.1';
    rightCtrl.style.opacity = '0.1';

    var innerWd = window.innerWidth,
        innerHi = window.innerHeight;
    var b,
        autoFit = true,
        wd_ = 900,
        hi_ = 700,
        fullSize = false;
    if (config.size && (b = (config.size + '').split('x')).length == 2) {
      wd_ = parseFloat(b[0]);
      if (wd_ <= 0) wd_ = 0;else if (wd_ <= 0.9999) {
        if (wd_ == 0.9999) wd_ = innerWd;else wd_ = Math.floor(innerWd * wd_);
      } else wd_ = Math.max(200, wd_);

      hi_ = parseFloat(b[1]);
      if (hi_ <= 0) {
        hi_ = 0;
        if (wd_ == 0) fullSize = true;
      } else if (hi_ <= 0.9999) {
        if (hi_ == 0.9999) hi_ = innerHi;else hi_ = Math.floor(innerHi * hi_);
      } else hi_ = Math.max(160, hi_);
      autoFit = false;
    }

    if (fullSize) {
      SLIDE_HALF_WIDTH = Math.floor(innerWd / 2);
      SLIDE_HALF_HEIGHT = Math.floor(innerHi / 2);
      SLIDE_GAP_WIDTH = 0;
    } else if (autoFit) {
      if (innerWd - 20 < wd_) SLIDE_HALF_WIDTH = Math.floor((innerWd - 20) / 2);else SLIDE_HALF_WIDTH = Math.floor(wd_ / 2);
      if (innerHi - 16 < hi_) SLIDE_HALF_HEIGHT = Math.floor((innerHi - 16) / 2);else SLIDE_HALF_HEIGHT = Math.floor(hi_ / 2);
      SLIDE_GAP_WIDTH = Math.min(100, innerWd - SLIDE_HALF_WIDTH - SLIDE_HALF_WIDTH & 0xFFFFFFFE);
    } else {
      if (wd_ == 0) wd_ = innerWd - 20;
      SLIDE_HALF_WIDTH = Math.floor(wd_ / 2);
      if (hi_ == 0) hi_ = innerHi - 16;
      SLIDE_HALF_HEIGHT = Math.floor(hi_ / 2);
      SLIDE_GAP_WIDTH = Math.min(100, innerWd - SLIDE_HALF_WIDTH - SLIDE_HALF_WIDTH & 0xFFFFFFFE);
    }

    var iTmp;
    if (config.pageGap && !isNaN(iTmp = parseInt(config.pageGap))) {
      if (iTmp > 0) SLIDE_GAP_WIDTH = iTmp;
    }

    if (config.backgroundColor) {
      var comp = topmostWidget_.component;
      if (comp) comp.duals.style = { backgroundColor: config.backgroundColor };
    }

    if (config.noSidebar) pageCtrl.setDisplay({ leftCtrlWidth: 0, rightCtrlWidth: 0 });else {
      setTimeout(function () {
        leftCtrl.style.opacity = '0';
        rightCtrl.style.opacity = '0';
        setTimeout(function () {
          leftCtrl.style.opacity = '0.1';
          rightCtrl.style.opacity = '0.1';
          setTimeout(function () {
            leftCtrl.style.opacity = '0';
            rightCtrl.style.opacity = '0';
          }, 500);
        }, 300);
      }, 1000); // hint control bar
    }

    if (config.noFrame) containNode_.classList.add('no-frame');
    if (config.noTrans) containNode_.classList.add('no-trans');
    if (config.noGround) containNode_.classList.add('no-ground');

    if (!config.noKeypress) {
      document.addEventListener('keydown', function (event) {
        var code = event.keyCode,
            done = false;
        withStepNext = false;
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          if (code == 39 || code == 40 || code == 34 || code == 13 || code == 32) {
            // right, down, PgDn, Enter, space
            withStepNext = true;
            pageCtrl.nextPage();
            done = true;
          } else if (code == 37 || code == 38 || code == 33) {
            // left, up, PgUp
            pageCtrl.prevPage();
            done = true;
          }
        } else if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          if (code == 36) {
            // ctrl + home
            pageCtrl.gotoPage(0);
            done = true;
          } else if (code == 35) {
            // ctrl + end
            pageCtrl.gotoPage(utils.pageCtrl.keys.length - 1);
            done = true;
          }
        } else if (event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          if (code == 38) {
            // cmd + up
            pageCtrl.gotoPage(0);
            done = true;
          } else if (code == 40) {
            // cmd + down
            pageCtrl.gotoPage(utils.pageCtrl.keys.length - 1);
            done = true;
          }
        }

        if (done) event.preventDefault();
      }, false);
    }

    if (!config.autoplay || !config.loopback) prepare_loopback_ = false;

    pageCtrl.renewPages = function (bNew) {
      var newKeys = [],
          newNamed = {},
          newSlides = [],
          bAdd = [];
      var oldKey = pageCtrl.keys,
          oldIdx = pageCtrl.pageIndex;
      bNew.forEach(function (item) {
        var sKey = item[0],
            comp = item[1];
        if (parseInt(sKey) + '' !== sKey) newNamed[sKey] = newKeys.length;
        if (!comp.whenSlideLeave) // means not call pageCtrl.initPage() yet
          bAdd.push([sKey, comp, newKeys.length]);
        newKeys.push(sKey);
        newSlides.push(comp);
      });

      // step 1: update slideHiter
      oldKey.forEach(function (sKey) {
        if (newKeys.indexOf(sKey) < 0) delete slideHiter[sKey];
      });

      // step 2: prepare new created pages
      if (bAdd.length && slideState > 0) {
        // slideState > 0 means already in running
        containNode_.classList.add('no-trans'); // ignore transition
        setTimeout(function () {
          containNode_.classList.remove('no-trans');
        }, 100);

        SCREEN_CENTER_Y = Math.floor(window.innerHeight / 2);
        var topY = SCREEN_CENTER_Y - SLIDE_HALF_HEIGHT;
        var wd = SLIDE_HALF_WIDTH + SLIDE_HALF_WIDTH;
        var hi = SLIDE_HALF_HEIGHT + SLIDE_HALF_HEIGHT;

        var bChild = [];
        bAdd.forEach(function (item) {
          var sKey = item[0],
              comp = item[1],
              idx = item[2];
          var b = pageCtrl.initPage(comp, sKey, idx, wd, hi, topY);
          array_push_.apply(bChild, b);
        });
        bChild.forEach(function (item) {
          utils.addClass(item[0], item[1]); // delay add prebuild-N
        });
      }

      // step 3: auto goto page
      var iPos,
          sCurr = oldKey[oldIdx],
          hasOldPg = typeof sCurr == 'string';
      pageCtrl.keys = newKeys;
      pageCtrl.namedPage = newNamed;
      slideEls = newSlides;
      if (hasOldPg && (iPos = newKeys.indexOf(sCurr)) >= 0) pageCtrl.pageIndex = iPos; // not shift page
      else {
          var iJump = 0;
          if (hasOldPg) {
            for (var i = oldIdx - 1; i >= 0; i--) {
              var sKey = oldKey[i];
              if (sKey && (iPos = newKeys.indexOf(sKey)) >= 0) {
                iJump = i;
                break;
              }
            }
          }

          if (newKeys.length) {
            setTimeout(function () {
              pageCtrl.gotoPage(iJump);
            }, 300);
          } else pageCtrl.pageIndex = 0;
        }
    };

    pageCtrl.gotoPage_ = function (keys, pgIndex) {
      var sKey = keys[pgIndex];
      var comp = slideEls[pgIndex];
      if (sKey && comp) {
        setupFrames_(pageCtrl, pgIndex, withStepNext);
        withStepNext = false;
        return [sKey, comp.widget];
      } else return ['', null];
    };

    pageCtrl.isFirstEnter = function (node) {
      // call in onslideenter event
      if (!node || !node.classList.contains('rewgt-scene')) return false;
      var sKey = utils.keyOfNode(node);
      if (sKey) return (slideHiter[sKey] || 0) < 1;else return false;
    };

    pageCtrl.initPage = function (comp, sKey, pgIndex, wd, hi, topY) {
      var bRet = [];
      if (!comp.whenSlideLeave) comp.whenSlideLeave = onSlideLeave; // regist default callback

      var wdgt,
          node = comp.getHtmlNode();
      if (node && (wdgt = comp.widget)) {
        var blocks = node.querySelectorAll('div.rewgt-center > [data-prepost]');
        for (var i = 0, item; item = blocks[i]; i++) {
          var sKey = utils.keyOfNode(item);
          if (sKey) {
            var childComp = wdgt[sKey];
            childComp = childComp && childComp.component;
            if (childComp) {
              var sCss = trySetPreBuild(childComp);
              if (sCss) {
                if (prepare_loopback_) waitResetComps_.push(childComp); // record for restoring when auto-play loopback
                bRet.push([childComp, sCss]);
              }
            }
          }
        }

        blocks = node.querySelectorAll('.rewgt-static > .build, .rewgt-center > .build');
        for (var i = 0, item; item = blocks[i]; i++) {
          var inStatic = item.parentNode.classList.contains('rewgt-static');
          var sKey,
              bltWdgt = null;
          if (!inStatic && (sKey = utils.keyOfNode(item))) bltWdgt = sKey && wdgt[sKey];

          for (var i2 = 0, item2; item2 = item.children[i2]; i2++) {
            if (inStatic) item2.classList.add('to-build');else {
              // item.build direct under rewgt-scene
              if (bltWdgt && (sKey = utils.keyOfNode(item2))) {
                var childComp = bltWdgt[sKey];
                childComp = childComp && childComp.component;
                if (childComp) utils.addClass(childComp, 'to-build');
              }
            }
          }
        }
      }

      comp.duals.width = wd;
      comp.duals.height = hi;
      comp.duals.top = topY;
      comp.duals.borderWidth = [1, 1, 1, 1];

      return bRet;
    };

    pageCtrl.enterPage = function (event, comp, isFirstEnter) {
      if (W.__design__) return;

      if (last_step_player_) {
        tryPausePlayer(last_step_player_, true);
        last_step_player_ = null;
      }
      last_prepost_ = null;

      var node;
      if (isFirstEnter && (node = comp.getHtmlNode())) {
        var bList = [],
            hasJoin = false;
        var blocks = node.querySelectorAll('div.rewgt-center > [class*="prebuild-"]');
        for (var i = 0, block; block = blocks[i]; i++) {
          var s = block.getAttribute('data-prepost') || '',
              b = s.split('-');
          if (i == 0 && parseInt(b[4])) hasJoin = true;
          if (b[0] === '18' || b[0] === '19' || b[2] === '18' || b[2] === '19') {
            var sKey = utils.keyOfNode(block);
            if (sKey) bList.push(sKey);
          }
        }

        var wdgt;
        if (bList.length && (wdgt = comp.widget)) {
          setTimeout(function () {
            bList.forEach(function (sKey) {
              var child = wdgt[sKey],
                  childComp = child && child.component;
              if (childComp && typeof childComp.playOnEnter == 'function') {
                if (childComp.playOnEnter() && typeof childComp.stepPlay == 'function') childComp.stepPlay(0); // 0 means not specify speed
              }
            });
          }, 300);
        }

        if (hasJoin) {
          var targ = event.target;
          setTimeout(function () {
            checkJoinedStep(targ);
          }, 300);
        }
      }
    };

    var iPage = config.page || 0;
    if (typeof iPage == 'string') iPage = pageCtrl.namedPage[iPage] || 0;
    if (typeof iPage != 'number') iPage = 0;
    // withStepNext = false;
    pageCtrl.pageIndex = iPage; // auto show first page, maybe jump again from #page
    setupFrames_(pageCtrl, iPage, withStepNext);

    if (config.autoplay) {
      if (typeof config.autoplay != 'number') config.autoplay = 0;else setTimeout(autoPlaySlide, config.autoplay * 1000);
    }
  }

  function autoPlaySlide() {
    if (!slideEls.length || !config.autoplay) return; // exit auto play
    if (typeof config.autoplay != 'number') return; // exit auto play

    if (pageCtrl.pageIndex >= slideEls.length - 1) {
      if (!config.loopback) return; // exit auto play

      prepare_loopback_ = false;
      containNode_.classList.add('no-trans');
      for (var i = waitResetComps_.length - 1; i >= 0; i--) {
        var comp = waitResetComps_[i];
        if (!comp.widget || !comp.isHooked || !comp.widget.parent) {
          waitResetComps_.splice(i, 1); // not available, just delete it
          continue;
        }

        if (last_step_player_) {
          tryPausePlayer(last_step_player_, true);
          last_step_player_ = null;
        }

        var mrg = (comp.state.margin || default_margin_).slice(0);
        mrg[0] = comp.oldMarginT || 0;mrg[3] = comp.oldMarginL || 0;
        var sty = { opacity: '', zIndex: (comp.oldZindex || 0) + '' };
        sty[TRANS_CSS_NAME] = '';

        comp.duals.margin = mrg;
        comp.duals.style = sty;
      }

      setTimeout(function () {
        containNode_.classList.remove('no-trans');

        slideState = 0;slideHiter = {};
        last_prepost_ = null;last_step_player_ = null;
        pageCtrl.gotoPage(0);
      }, 300);
    } else pageCtrl.gotoPage(pageCtrl.pageIndex + 1);

    setTimeout(autoPlaySlide, config.autoplay * 1000);
  }

  function tryPausePlayer(player, isJmpPg) {
    var wdgt = player.widget;
    if (wdgt && wdgt.parent) {
      // still avaliable
      if (typeof player.stepPause == 'function') player.stepPause(isJmpPg ? 'JUMP_PAGE' : 'NEXT_PAGE');
    }
  }

  function trySetPreBuild(comp) {
    var s = comp.state['data-prepost'],
        ret = '';
    if (!s) return ret;

    var b = s.split('-');
    if (b.length >= 2) {
      var index = parseInt(b[0]),
          iSpeed = parseInt(b[1]);
      if (isNaN(index) || !(iSpeed >= 1 && iSpeed <= 5)) return ret;

      comp.oldZindex = parseInt((comp.state.style || {}).zIndex) || 0;
      if (index == 0 || index == 18 || index == 19) {
        // index==18 play, index==19 pause
        if (index == 0 && b.length >= 4) {
          var postIndex = parseInt(b[2]);
          if (postIndex == 13) // restore
            comp.duals.style = { opacity: '0' }; // hide first
          else if (postIndex == 11 || postIndex == 12) // bring top or push bottom
              comp.duals.style = { opacity: '0.98' }; // let TRANS_END_FUNC can be called
        }

        var mrg = comp.state.margin || default_margin_;
        ret = 'prebuild-' + iSpeed;
        comp.oldMarginL = mrg[3];
        comp.oldMarginT = mrg[0];
      } else if (index >= 1 && index <= 17) {
        var x = comp.state.left || 0,
            y = comp.state.top || 0;
        var wd = comp.state.width || 200,
            hi = comp.state.height || 0;
        if (!hi) {
          var node = comp.getHtmlNode();
          if (node) hi = node.clientHeight || 100;
        }
        var mrg = (comp.state.margin || default_margin_).slice(0);
        var oldLeft = mrg[3],
            oldTop = mrg[0];

        if (index <= 4) {
          if (index == 1) // enter from top
            mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;else if (index == 2) // enter from right
            mrg[3] = SLIDE_HALF_WIDTH - x;else if (index == 3) // enter from bottom
            mrg[0] = SLIDE_HALF_HEIGHT - y;else mrg[3] = -SLIDE_HALF_WIDTH - x - wd; // enter from left
          comp.duals.margin = mrg;
          comp.duals.style = { opacity: '0' };
        } else if (index <= 8) {
          var sty = { opacity: '0' };
          if (index == 5) {
            // enter from top-right, rotate
            mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
            mrg[3] = SLIDE_HALF_WIDTH - x;
            sty[TRANS_CSS_NAME] = 'rotate(-215deg) scale(0.2,0.2)';
          } else if (index == 6) {
            // enter from bottom-right, rotate
            mrg[0] = SLIDE_HALF_HEIGHT - y;
            mrg[3] = SLIDE_HALF_WIDTH - x;
            sty[TRANS_CSS_NAME] = 'rotate(215deg) scale(0.2,0.2)';
          } else if (index == 7) {
            // enter from bottom-left, rotate
            mrg[0] = SLIDE_HALF_HEIGHT - y;
            mrg[3] = -SLIDE_HALF_WIDTH - x - wd;
            sty[TRANS_CSS_NAME] = 'rotate(-215deg) scale(0.2,0.2)';
          } else {
            // enter from top-left, rotate
            mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
            mrg[3] = -SLIDE_HALF_WIDTH - x - wd;
            sty[TRANS_CSS_NAME] = 'rotate(215deg) scale(0.2,0.2)';
          }
          comp.duals.margin = mrg;
          comp.duals.style = sty;
        } else if (index == 9) {
          var sty = { opacity: '0' };
          sty[TRANS_CSS_NAME] = 'scale(0.1,0.1)';
          comp.duals.style = sty;
        } else if (index == 10) {
          var sty = { opacity: '0' };
          sty[TRANS_CSS_NAME] = 'rotate(1800deg) scale(0.1,0.1)';
          comp.duals.style = sty;
        } else if (index <= 13) {
          if (index == 13) comp.duals.style = { opacity: '0' };else // index=11:bring to top, index=12:push to bottom, set opacity for TRANS_END_FUNC callback
            comp.duals.style = { opacity: '0.98' };
        } else if (index == 14) {
          // scale from 0.6
          var sty = {};
          sty[TRANS_CSS_NAME] = 'scale(0.6,0.6)';
          comp.duals.style = sty;
        } else if (index == 15) {
          // scale from 0.8
          var sty = {};
          sty[TRANS_CSS_NAME] = 'scale(0.8,0.8)';
          comp.duals.style = sty;
        } else if (index == 16) {
          // scale from 1.2
          var sty = {};
          sty[TRANS_CSS_NAME] = 'scale(1.2,1.2)';
          comp.duals.style = sty;
        } else {
          // index==17, scale from 1.4
          var sty = {};
          sty[TRANS_CSS_NAME] = 'scale(1.4,1.4)';
          comp.duals.style = sty;
        }

        ret = 'prebuild-' + iSpeed;
        comp.oldMarginL = oldLeft;
        comp.oldMarginT = oldTop;
      }
    }
    return ret;
  }

  function onSlideLeave() {
    var doAnyBuild = false;
    var wdgt,
        block,
        node = this.getHtmlNode();
    if (node && (wdgt = this.widget)) {
      if (last_prepost_) {
        if (last_prepost_.parentNode) {
          // has last_prepost and still available
          block = last_prepost_.querySelector('.build > .to-build');
          if (block) {
            actToBuild(wdgt, block);
            return false;
          }
          if (trySetPostBuild(wdgt, last_prepost_)) doAnyBuild = true;
        }
        last_prepost_ = null;
      }

      var blocks = node.querySelectorAll('div.rewgt-center > [class*="prebuild-"]');
      var block = blocks[0];
      if (block) {
        var nextBlock = null,
            sPrepost = block.getAttribute('data-prepost') || '';
        if (sPrepost.startsWith('0-')) {
          // only post-step
          var bList = [block];
          block = null;

          for (var i2 = 1, block2; block2 = blocks[i2]; i2++) {
            var sPrepost2 = block2.getAttribute('data-prepost') || '';
            if (sPrepost2.startsWith('0-')) bList.push(block2);else {
              block = block2;
              sPrepost = sPrepost2;
              nextBlock = blocks[i2 + 1];
              break;
            }
          }

          bList.forEach(function (block) {
            if (trySetPostBuild(wdgt, block)) doAnyBuild = true;
          });
        } else nextBlock = blocks[1];

        var sKey = block && utils.keyOfNode(block);
        if (sKey) {
          var childComp = wdgt[sKey];
          childComp = childComp && childComp.component;
          if (childComp && (last_prepost_ = childComp.getHtmlNode())) {
            var bSeg = sPrepost.split('-'),
                sIndex = bSeg[0];
            var sty = { opacity: '' };
            var mrg = (childComp.state.margin || default_margin_).slice(0);
            mrg[0] = childComp.oldMarginT || 0;
            mrg[3] = childComp.oldMarginL || 0;
            sty[TRANS_CSS_NAME] = '';

            var isPlayer = false;
            if (sIndex == '11') // bring to top
              sty.zIndex = maxZLevelOfPage(wdgt) + '';else if (sIndex == '12') // push to bottom
              sty.zIndex = minZLevelOfPage(wdgt) + '';else if (sIndex == '18') {
              // play
              isPlayer = true;
              if (typeof childComp.stepPlay == 'function') {
                var iSpeed = parseInt(bSeg[1] || '3');
                childComp.stepPlay(iSpeed); // 3 is normal, 1 is fastest:  1,2,3,4,5

                var sPrepost2 = nextBlock && nextBlock.getAttribute('data-prepost');
                if (sPrepost2 && parseInt(sPrepost2.split('-')[4])) // joined
                  last_step_player_ = childComp;
              }
            } else if (sIndex == '19') {
              isPlayer = true;
              if (typeof childComp.stepPause == 'function') childComp.stepPause('PRE_STEP');
            }

            if (isPlayer) utils.removeClass(childComp, ['prebuild-1', 'prebuild-2', 'prebuild-3', 'prebuild-4', 'prebuild-5']);else last_prepost_.addEventListener(TRANS_END_FUNC, getStepEndFunc(true, wdgt), false);

            childComp.duals.margin = mrg;
            childComp.duals.style = sty;
            return false;
          }
        }
      }

      block = node.querySelector('.build > .to-build');
      if (block) {
        actToBuild(wdgt, block);
        return false;
      }
    }

    if (!doAnyBuild && last_step_player_) {
      tryPausePlayer(last_step_player_, false);
      last_step_player_ = null;
    }
    return !doAnyBuild; // return false if has post-step
  }

  function getStepEndFunc(isPreStep, slideWdgt) {
    var _retFunc = function retFunc(event) {
      var node = event.target;
      node.removeEventListener(TRANS_END_FUNC, _retFunc);
      _retFunc = null;

      var slideNode = slideWdgt.parent && slideWdgt.component;
      slideNode = slideNode && slideNode.getHtmlNode();
      if (!slideNode) return;

      var sKey = utils.keyOfNode(node);
      var childComp = sKey && slideWdgt[sKey];
      childComp = childComp && childComp.component;
      if (childComp) {
        if (isPreStep) {
          utils.removeClass(childComp, ['prebuild-1', 'prebuild-2', 'prebuild-3', 'prebuild-4', 'prebuild-5']);
          setTimeout(function () {
            checkJoinedStep(slideNode);
          }, 300); // ensure prebuild-N removed
        } else utils.removeClass(childComp, ['postbuild-1', 'postbuild-2', 'postbuild-3', 'postbuild-4', 'postbuild-5']);
      }
    };
    return _retFunc;
  }

  function maxZLevelOfPage(wdgt) {
    var iRet = -999,
        iCount = 0;
    utils.eachElement(wdgt.component, function (child) {
      var comp,
          sKey = utils.keyOfElement(child);
      if (sKey && (comp = wdgt[sKey])) {
        comp = comp.component;
        if (comp) {
          iCount += 1;
          var index = parseInt(comp.state.style.zIndex || '0');
          if (index > iRet) iRet = index;
        }
      }
    });

    if (iCount == 0) return 0;else if (iRet >= 999) return 999;else return iRet + 1;
  }

  function minZLevelOfPage(wdgt) {
    var iRet = 999,
        iCount = 0;
    utils.eachElement(wdgt.component, function (child) {
      var comp,
          sKey = utils.keyOfElement(child);
      if (sKey && (comp = wdgt[sKey])) {
        comp = comp.component;
        if (comp) {
          iCount += 1;
          var index = parseInt(comp.state.style.zIndex || '0');
          if (index < iRet) iRet = index;
        }
      }
    });

    if (iCount == 0) return 0;else if (iRet <= -999) return -999;else return iRet - 1;
  }

  function actToBuild(wdgt, block) {
    var bltNode = block.parentNode;
    var inStatic = bltNode.parentNode.classList.contains('rewgt-static');
    if (!inStatic) {
      var sKey = utils.keyOfNode(bltNode),
          sKey2 = utils.keyOfNode(block);
      var bltComp = sKey && wdgt[sKey];
      bltComp = bltComp && sKey2 && bltComp[sKey2];
      bltComp = bltComp && bltComp.component;
      if (bltComp) {
        utils.removeClass(bltComp, 'to-build');
        return;
      }
    }
    block.classList.remove('to-build');
  }

  function trySetPostBuild(wdgt, node) {
    var sKey = utils.keyOfNode(node);
    if (!sKey) return false;

    var comp = wdgt[sKey];
    comp = comp && comp.component;
    if (!comp) return false;

    var s = comp.state['data-prepost'] || '',
        b = s.split('-');
    if (b.length >= 4) {
      var index = parseInt(b[2]),
          iSpeed = parseInt(b[3]);
      if (index >= 1 && index <= 17) {
        if (iSpeed >= 1 && iSpeed <= 5) {
          utils.setClass(comp, remove_pre_cls_.concat(['postbuild-' + iSpeed]));
          setTimeout(function () {
            // postbuild-N is added
            node.addEventListener(TRANS_END_FUNC, getStepEndFunc(false, wdgt), false);
            animatePost();
          }, 300);
          return true;
        }
      } else if (index == 18) {
        // play, post-step no need check next joined
        utils.setClass(comp, remove_pre_cls_);
        if (typeof comp.stepPlay == 'function') comp.stepPlay(iSpeed); // 3 is normal, 1 is fastest:  1,2,3,4,5
        return true;
      } else if (index == 19) {
        // pause
        utils.setClass(comp, remove_pre_cls_);
        if (typeof comp.stepPause == 'function') comp.stepPause('POST_STEP');
        return true;
      }
    }

    utils.setClass(comp, remove_pre_cls_);
    return false;

    function animatePost() {
      var x = comp.state.left || 0,
          y = comp.state.top || 0;
      var wd = comp.state.width || 200,
          hi = comp.state.height || 0;
      if (!hi) hi = node.clientHeight || 100;
      var mrg = (comp.state.margin || default_margin_).slice(0);

      if (index <= 4) {
        if (index == 1) // retired to top
          mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;else if (index == 2) // retired to right
          mrg[3] = SLIDE_HALF_WIDTH - x;else if (index == 3) // retired to bottom
          mrg[0] = SLIDE_HALF_HEIGHT - y;else mrg[3] = -SLIDE_HALF_WIDTH - x - wd; // retired to left
        comp.duals.margin = mrg;
        comp.duals.style = { opacity: '0' };
      } else if (index <= 8) {
        var sty = { opacity: '0' };
        if (index == 5) {
          // retired to top-right, rotate
          mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
          mrg[3] = SLIDE_HALF_WIDTH - x;
          sty[TRANS_CSS_NAME] = 'rotate(-215deg) scale(0.2,0.2)';
        } else if (index == 6) {
          // retired to bottom-right, rotate
          mrg[0] = SLIDE_HALF_HEIGHT - y;
          mrg[3] = SLIDE_HALF_WIDTH - x;
          sty[TRANS_CSS_NAME] = 'rotate(215deg) scale(0.2,0.2)';
        } else if (index == 7) {
          // retired to bottom-left, rotate
          mrg[0] = SLIDE_HALF_HEIGHT - y;
          mrg[3] = -SLIDE_HALF_WIDTH - x - wd;
          sty[TRANS_CSS_NAME] = 'rotate(-215deg) scale(0.2,0.2)';
        } else {
          // retired to top-left, rotate
          mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
          mrg[3] = -SLIDE_HALF_WIDTH - x - wd;
          sty[TRANS_CSS_NAME] = 'rotate(215deg) scale(0.2,0.2)';
        }
        comp.duals.margin = mrg;
        comp.duals.style = sty;
      } else if (index == 9) {
        // scale out, no move, no rotate
        var sty = { opacity: '0' };
        sty[TRANS_CSS_NAME] = 'scale(0.1,0.1)';
        comp.duals.style = sty;
      } else if (index == 10) {
        // rotate scale out, no move
        var sty = { opacity: '0' };
        sty[TRANS_CSS_NAME] = 'rotate(1800deg) scale(0.1,0.1)';
        comp.duals.style = sty;
      } else if (index <= 13) {
        var sty = { opacity: '0.99' };
        if (index == 11) // bring to top
          sty.zIndex = maxZLevelOfPage(wdgt) + '';else if (index == 12) // push to bottom
          sty.zIndex = minZLevelOfPage(wdgt) + '';else sty.zIndex = (comp.oldZindex || 0) + ''; // index == 13, restore
        comp.duals.style = sty;
      } else if (index <= 17) {
        var sty = {};
        if (index == 14) // scale to 0.6
          sty[TRANS_CSS_NAME] = 'scale(0.6,0.6)';else if (index == 15) // scale to 0.8
          sty[TRANS_CSS_NAME] = 'scale(0.8,0.8)';else if (index == 16) // scale to 1.2
          sty[TRANS_CSS_NAME] = 'scale(1.2,1.2)';else sty[TRANS_CSS_NAME] = 'scale(1.4,1.4)'; // scale to 1.4
        comp.duals.style = sty;
      }
    }
  }
});
