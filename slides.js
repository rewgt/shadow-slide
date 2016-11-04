// slides.js

var React = require('react');
var ReactDOM = require('react-dom');
var W = require('shadow-widget');

var T = W.$templates, creator = W.$creator;
var utils = W.$utils, ex = W.$ex, main = W.$main;

var containNode_   = null;
var topmostWidget_ = null;

var WEB_BROWSER_TYPE = '';
var WEB_BROWSER_VER  = '';
var TRANS_END_FUNC   = '';
var TRANS_CSS_NAME   = '';

var SLIDE_HALF_WIDTH  = 450;
var SLIDE_HALF_HEIGHT = 350;
var SLIDE_GAP_WIDTH   = 100;
var SCREEN_CENTER_X   = Math.floor(window.innerWidth / 2);
var SCREEN_CENTER_Y   = Math.floor(window.innerHeight / 2);

var slideState = 0;   // 0:init, else started
var slideEls   = [];
var slideHiter = {};

var last_prepost_     = null;  // node
var last_step_player_ = null;  // component

var array_push_ = Array.prototype.push;
var default_margin_ = [0,0,0,0];

var waitResetComps_   = [];
var prepare_loopback_ = true;

function getUrlParam(s) {
  var dRet = {}, b = s.split('&');
  b.forEach( function(item) {
    if (!item) return;
    var b2 = item.split('='), sName = b2[0].trim();
    if (sName)
      dRet[sName] = (b2[1] || '').trim();
  });
  return dRet;
}

function makeConfig() {
  var cfg = getUrlParam(window.location.search.slice(1));
  var bRmv = [], hyphenPattern = /-(.)/g;
  
  Object.keys(cfg).forEach( function(sKey) {
    var value = cfg[sKey];
    var sKey2 = sKey.replace(hyphenPattern, function(_,chr) {
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
        if (typeof f == 'number' && (f+'') === value)
          cfg[sKey] = f;
        else cfg[sKey] = value;
      }
      else cfg[sKey] = value;
    }
    else cfg[sKey] = 1;  // &no-frame&no-ground  --> noFrame=1, noGround=1
  });
  
  bRmv.forEach( function(sKey) {
    delete cfg[sKey];
  });
  return cfg;
}

function checkJoinedStep(slideNode) {
  if (!slideNode.parentNode) return;        // invalid
  
  var block = slideNode.querySelector('div.rewgt-center > [class*="prebuild-"]');
  if (block) {
    var s = block.getAttribute('data-prepost') || '';
    var b = s.split('-');
    if (b.length >= 5 && parseInt(b[4]))    // exist joined step
      setupFrames_(utils.pageCtrl,utils.pageCtrl.pageIndex,true);
  }
}

function setupFrames_(pageCtrl,iCurr,withStepNext) {
  if (last_step_player_) {
    var slideWdgt, wdgt = last_step_player_.widget, stepDone = false;
    if (wdgt && (slideWdgt=wdgt.parent)) {  // still avaliable
      if (typeof last_step_player_.stepIsDone == 'function') {
        if (last_step_player_.stepIsDone()) {
          stepDone = true;
          last_step_player_ = null;
        }
      }
      else last_step_player_ = null;
    }
    else last_step_player_ = null;
    
    if (last_step_player_) {
      setTimeout( function() {
        setupFrames_(pageCtrl,iCurr,withStepNext);
      },600);  // check again after 0.6 second
      return;
    }
    
    if (stepDone) {
      var slideComp = slideWdgt.component, slideNode = slideComp && slideComp.getHtmlNode();
      if (slideNode)
        checkJoinedStep(slideNode);
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
    
    containNode_.classList.add('no-trans');  // ignore first time transition
    setTimeout( function() {
      containNode_.classList.remove('no-trans');
    },1200);
    
    var wd = SLIDE_HALF_WIDTH + SLIDE_HALF_WIDTH;
    var hi = SLIDE_HALF_HEIGHT + SLIDE_HALF_HEIGHT;
    
    // scan slideEls, ensure component exists
    var keys = [], namedPage = {};
    pageCtrl.keys.forEach( function(sKey) {
      var comp = topmostWidget_[sKey];
      if (comp && (comp=comp.component)) {
        var sName = comp.props.name;
        if (sName && typeof sName == 'string')
          namedPage[sName] = slideEls.length;
        slideEls.push(comp);
        keys.push(sKey);
      }
    });
    pageCtrl.keys = keys;
    pageCtrl.namedPage = namedPage;
    
    var bChild = [];
    slideEls.forEach( function(comp,idx) {
      var b = pageCtrl.initPage(comp,keys[idx],idx,wd,hi,topY);
      array_push_.apply(bChild,b);
    });
    setTimeout( function() {
      bChild.forEach( function(item) {
        utils.addClass(item[0],item[1]); // delay add prebuild-N
      });
    },1000);
  }
  else slideState += 1;
  
  var tp = typeof iCurr;
  if (tp == 'string') {
    var iTmp = parseInt(iCurr);
    if ((iTmp + '') == iCurr) {
      iCurr = iTmp;
      tp = 'number';
    }
    else {
      iCurr = pageCtrl.namedPage[iCurr];
      tp = typeof iCurr;
    }
  }
  
  if (tp != 'number') return;
  var iLen = pageCtrl.keys.length;
  if (!iLen) return;
  if (iCurr >= iLen) iCurr = iLen - 1;
  if (iCurr < 0) iCurr = 0;
  if (iCurr === lastPgIndex && !withStepNext) return;  // no need change page
  
  if (withStepNext && lastPgIndex >= 0) {        // try step next, must not first time
    var slideComp = slideEls[lastPgIndex];
    if (slideComp) {
      var toLeave = !slideComp.whenSlideLeave(); // slideComp.whenSlideLeave must exist
      if (toLeave) { // step is hit
        if (last_prepost_ && last_step_player_) {
          setTimeout( function() {
            setupFrames_(pageCtrl,iCurr,withStepNext); // wait checking step finish or not
          },300);
        }
        return;
      }
    }
  }
  
  if (isFirstTime) {
    setTimeout( function() {
      dispatchEnter();
    },0);  // wait for prepare pre-post finished
  }
  else dispatchEnter();
  
  function dispatchEnter() {
    var curr = SCREEN_CENTER_X - SLIDE_HALF_WIDTH;
    var next1 = SCREEN_CENTER_X + SLIDE_HALF_WIDTH + SLIDE_GAP_WIDTH;
    var next2 = next1 + SLIDE_HALF_WIDTH + SLIDE_HALF_WIDTH + SLIDE_GAP_WIDTH;
    var prev1 = curr - SLIDE_HALF_WIDTH - SLIDE_HALF_WIDTH - SLIDE_GAP_WIDTH;
    var prev2 = prev1 - SLIDE_HALF_WIDTH - SLIDE_HALF_WIDTH - SLIDE_GAP_WIDTH;
    
    var node, currComp = null, currKey = '';
    slideEls.forEach( function(comp,iPage) {
      var hideIt = false;
      comp.duals.top = topY;
      if (iPage <= iCurr) {
        if (iPage == iCurr) {
          comp.duals.left = curr;
          currComp = comp;
          currKey = pageCtrl.keys[iCurr];
        }
        else if (iPage == iCurr-1)
          comp.duals.left = prev1;
        else if (iPage == iCurr-2)
          comp.duals.left = prev2;
        else hideIt = true;
      }
      else if (iPage == iCurr + 1)
        comp.duals.left = next1;
      else if (iPage == iCurr + 2)
        comp.duals.left = next2;
      else hideIt = true;
      
      if (hideIt) {
        comp.duals.left = curr;
        if (comp.state.style.display != 'none')
          comp.duals.style = {display:'none'};
      }
      else {
        if (comp.state.style.display != 'block')
          comp.duals.style = {display:'block'};
      }
    });
    if (!currComp || !currKey) return;
    
    pageCtrl.pageIndex = iCurr;  // save it only when it is changed
    var node = currComp.getHtmlNode();
    if (!node) return;
    
    var evt = document.createEvent('Event');
    evt.initEvent('slideenter',true,true);
    evt.pageKey = currKey;
    evt.pageIndex = iCurr;
    node.dispatchEvent(evt);
    
    setTimeout( function() {
      var prevented = false;
      if (typeof evt.isDefaultPrevented == 'function')  // maybe wrapped by jQuery
        prevented = evt.isDefaultPrevented();
      else prevented = !!evt.defaultPrevented;
      
      if (!prevented) {
        var iNum = (slideHiter[currKey] || 0) + 1;
        slideHiter[currKey] = iNum;
        if (isFirstTime) {
          setTimeout( function() {
            pageCtrl.enterPage(evt,currComp,iNum == 1);
          },1000);  // waiting for prebuild-N ready
        }
        else pageCtrl.enterPage(evt,currComp,iNum == 1);
      }
    },0);
  }
}

(function() {
  var sUA = navigator.userAgent.toLowerCase();
  var m = sUA.match(/trident.*rv[ :]*([\d.]+)/); // >= IE11, can not use sUA.match(/msie ([\d.]+)/)
  if (m) {
    if (parseFloat(m[1]) >= 11.0) {
      WEB_BROWSER_TYPE = 'ie'; WEB_BROWSER_VER = m[1];
      TRANS_END_FUNC = 'MSTransitionEnd'; TRANS_CSS_NAME = 'msTransform'; // 'transform' or 'msTransform' can work also
    }
  } else {
    m = sUA.match(/firefox\/([\d.]+)/);
    if (m) {
      WEB_BROWSER_TYPE = 'firefox'; WEB_BROWSER_VER = m[1];
      TRANS_END_FUNC = 'transitionend'; TRANS_CSS_NAME = 'transform';
    } else {
      m = sUA.match(/chrome\/([\d.]+)/);
      if (m) {
        WEB_BROWSER_TYPE = 'chrome'; WEB_BROWSER_VER = m[1];
        TRANS_END_FUNC = 'webkitTransitionEnd'; TRANS_CSS_NAME = 'WebkitTransform';
      }
      else {
        m = sUA.match(/opera.([\d.]+)/);
        if (m) {
          WEB_BROWSER_TYPE = 'opera'; WEB_BROWSER_VER = m[1];
          TRANS_END_FUNC = 'oTransitionEnd'; TRANS_CSS_NAME = 'transform';
        }
        else {
          m = sUA.match(/safari\/([\d.]+)/);
          if (m) {
            WEB_BROWSER_TYPE = 'safari'; WEB_BROWSER_VER = m[1];
            TRANS_END_FUNC = 'webkitTransitionEnd'; TRANS_CSS_NAME = 'WebkitTransform';
          }
          else {
            m = sUA.match(/webkit\/([\d.]+)/);
            if (m) {  // webkit kernel, iPad ...
              WEB_BROWSER_TYPE = 'webkit'; WEB_BROWSER_VER = m[1];
              TRANS_END_FUNC = 'webkitTransitionEnd'; TRANS_CSS_NAME = 'WebkitTransform';
            }
          }
        }
      }
    }
  }
  
  if (WEB_BROWSER_TYPE == '' || WEB_BROWSER_VER == '') {
    if (sUA.match(/msie ([\d.]+)/))
      console.log('!fatal error: IE version too low, please use IE11 or higher');
    else console.log('!fatal error: unknown web browser type'); // only support firefox/chrome/safari/opera/IE
  }
})();

main.$onLoad.push( function() {
  containNode_ = creator.containNode_;      // must be exists
  topmostWidget_ = creator.topmostWidget_;  // must be exists
  if (!containNode_ || !topmostWidget_) return;
  
  var config, withStepNext = false, pageCtrl = utils.pageCtrl;
  var leftCtrl = pageCtrl.leftPanel, rightCtrl = pageCtrl.rightPanel;
  
  if (leftCtrl && rightCtrl && pageCtrl.gotoPage_) {  // can replace
    config = makeConfig();
    if (pageCtrl.config)
      config = Object.assign({},pageCtrl.config,config);
    pageCtrl.config = config;
    
    leftCtrl.onclick = function(event) {
      withStepNext = false;
      pageCtrl.prevPage();
    };
    rightCtrl.onclick = function(event) {
      withStepNext = true;
      pageCtrl.nextPage();
    };
    
    leftCtrl.classList.add('wdgt-pgctrl');
    leftCtrl.classList.add('left');
    rightCtrl.classList.add('wdgt-pgctrl');
    rightCtrl.classList.add('right');
    leftCtrl.style.opacity = '0.1';
    rightCtrl.style.opacity = '0.1';
    
    var innerWd = window.innerWidth, innerHi = window.innerHeight;
    var b, autoFit = true, wd_ = 900, hi_ = 700, fullSize = false;
    if (config.size && (b=(config.size+'').split('x')).length == 2) {
      wd_ = parseFloat(b[0]);
      if (wd_ <= 0)
        wd_ = 0;
      else if (wd_ <= 0.9999) {
        if (wd_ == 0.9999)
          wd_ = innerWd;
        else wd_ = Math.floor(innerWd * wd_);
      }
      else wd_ = Math.max(200,wd_);
      
      hi_ = parseFloat(b[1]);
      if (hi_ <= 0) {
        hi_ = 0;
        if (wd_ == 0) fullSize = true;
      }
      else if (hi_ <= 0.9999) {
        if (hi_ == 0.9999)
          hi_ = innerHi;
        else hi_ = Math.floor(innerHi * hi_);
      }
      else hi_ = Math.max(160,hi_);
      autoFit = false;
    }
    
    if (fullSize) {
      SLIDE_HALF_WIDTH = Math.floor(innerWd / 2);
      SLIDE_HALF_HEIGHT = Math.floor(innerHi / 2);
      SLIDE_GAP_WIDTH = 0;
    }
    else if (autoFit) {
      if ((innerWd-20) < wd_)
        SLIDE_HALF_WIDTH = Math.floor((innerWd-20) / 2);
      else SLIDE_HALF_WIDTH = Math.floor(wd_ / 2);
      if ((innerHi-16) < hi_)
        SLIDE_HALF_HEIGHT = Math.floor((innerHi-16) / 2);
      else SLIDE_HALF_HEIGHT = Math.floor(hi_ / 2);
      SLIDE_GAP_WIDTH = Math.min(100,(innerWd - SLIDE_HALF_WIDTH - SLIDE_HALF_WIDTH) & 0xFFFFFFFE);
    }
    else {
      if (wd_ == 0) wd_ = innerWd - 20;
      SLIDE_HALF_WIDTH = Math.floor(wd_ / 2);
      if (hi_ == 0) hi_ = innerHi - 16;
      SLIDE_HALF_HEIGHT = Math.floor(hi_ / 2);
      SLIDE_GAP_WIDTH = Math.min(100,(innerWd - SLIDE_HALF_WIDTH - SLIDE_HALF_WIDTH) & 0xFFFFFFFE);
    }
    
    if (config.backgroundColor) {
      var comp = topmostWidget_.component;
      if (comp) comp.duals.style = {backgroundColor:config.backgroundColor};
    }
    
    if (config.noSidebar)
      pageCtrl.setDisplay({leftCtrlWidth:0,rightCtrlWidth:0});
    else {
      setTimeout( function() {
        leftCtrl.style.opacity = '0';
        rightCtrl.style.opacity = '0';
        setTimeout( function() {
          leftCtrl.style.opacity = '0.1';
          rightCtrl.style.opacity = '0.1';
          setTimeout( function() {
            leftCtrl.style.opacity = '0';
            rightCtrl.style.opacity = '0';
          },500);
        },300);
      },1000);  // hint control bar
    }
    
    if (config.noFrame)
      containNode_.classList.add('no-frame');
    if (config.noTrans)
      containNode_.classList.add('no-trans');
    if (config.noGround)
      containNode_.classList.add('no-ground');
    
    if (!config.noKeypress) {
      document.addEventListener('keydown', function(event) {
        var code = event.keyCode, done = false;
        withStepNext = false;
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          if (code == 39 || code == 40 || code == 34 || code == 13 || code == 32) { // right, down, PgDn, Enter, space
            withStepNext = true;
            pageCtrl.nextPage();
            done = true;
          }
          else if (code == 37 || code == 38 || code == 33) { // left, up, PgUp
            pageCtrl.prevPage();
            done = true;
          }
        }
        else if (event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
          if (code == 36) {     // ctrl + home
            pageCtrl.gotoPage(0);
            done = true;
          }
          else if (code == 35) { // ctrl + end
            pageCtrl.gotoPage(utils.pageCtrl.keys.length-1);
            done = true;
          }
        }
        else if (event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
          if (code == 38) {      // cmd + up
            pageCtrl.gotoPage(0);
            done = true;
          }
          else if (code == 40) { // cmd + down
            pageCtrl.gotoPage(utils.pageCtrl.keys.length-1);
            done = true;
          }
        }
        
        if (done) event.preventDefault();
      },false);
    }
    
    if (!config.autoplay || !config.loopback)
      prepare_loopback_ = false;
    
    pageCtrl.gotoPage_ = function(keys,pgIndex) {
      var sKey = keys[pgIndex];
      var comp = slideEls[pgIndex];
      if (sKey && comp) {
        setupFrames_(pageCtrl,pgIndex,withStepNext);
        withStepNext = false;
        return [sKey,comp.widget];
      }
      else return ['',null];
    };
    
    pageCtrl.isFirstEnter = function(node) { // call in onslideenter event
      if (!node || !node.classList.contains('rewgt-scene')) return false;
      var sKey = utils.keyOfNode(node);
      if (sKey)
        return (slideHiter[sKey] || 0) < 1;
      else return false;
    };
    
    pageCtrl.initPage = function(comp,sKey,pgIndex,wd,hi,topY) {
      var bRet = [];
      if (!comp.whenSlideLeave)
        comp.whenSlideLeave = onSlideLeave; // regist default callback
      
      var wdgt, node = comp.getHtmlNode();
      if (node && (wdgt=comp.widget)) {
        var blocks = node.querySelectorAll('div.rewgt-center > [data-prepost]');
        for (var i=0,item; item = blocks[i]; i++) {
          var sKey = utils.keyOfNode(item);
          if (sKey) {
            var childComp = wdgt[sKey];
            childComp = childComp && childComp.component;
            if (childComp) {
              var sCss = trySetPreBuild(childComp);
              if (sCss) {
                if (prepare_loopback_)
                  waitResetComps_.push(childComp);
                bRet.push([childComp,sCss]);
              }
            }
          }
        }
        
        blocks = node.querySelectorAll('.rewgt-static > .build, .rewgt-scene > .build');
        for (var i=0,item; item = blocks[i]; i++) {
          var inStatic = item.parentNode.classList.contains('rewgt-static');
          var sKey, bltWdgt = null;
          if (!inStatic && (sKey=utils.keyOfNode(item)))
            bltWdgt = sKey && wdgt[sKey];
          
          for (var i2=0,item2; item2=item.children[i2]; i2++) {
            if (inStatic)
              item2.classList.add('to-build');
            else { // item.build direct under rewgt-scene
              if (bltWdgt && (sKey=utils.keyOfNode(item2))) {
                var childComp = bltWdgt[sKey];
                childComp = childComp && childComp.component;
                if (childComp) utils.addClass(childComp,'to-build');
              }
            }
          }
        }
      }
      
      comp.duals.width = wd;
      comp.duals.height = hi;
      comp.duals.top = topY;
      comp.duals.borderWidth = [1,1,1,1];
      
      return bRet;
    };
    
    pageCtrl.enterPage = function(event,comp,isFirstEnter) {
      if (last_step_player_) {
        tryPausePlayer(last_step_player_,true);
        last_step_player_ = null;
      }
      last_prepost_ = null;
      
      if (isFirstEnter) {
        var targ = event.target;
        setTimeout( function() {
          checkJoinedStep(targ);
        },300);
      }
    };
    
    var iPage = config.page || 0;
    if (typeof iPage == 'string')
      iPage = pageCtrl.namedPage[iPage] || 0;
    if (typeof iPage != 'number') iPage = 0;
    // withStepNext = false;
    pageCtrl.pageIndex = iPage;   // auto show first page, maybe jump again from #page
    setupFrames_(pageCtrl,iPage,withStepNext);
    
    if (config.autoplay) {
      if (typeof config.autoplay != 'number')
        config.autoplay = 0;
      else setTimeout(autoPlaySlide,config.autoplay * 1000);
    }
  }
  
  function autoPlaySlide() {
    if (!slideEls.length || !config.autoplay) return; // exit auto play
    if (typeof config.autoplay != 'number') return;   // exit auto play
    
    if (pageCtrl.pageIndex >= slideEls.length-1) {
      if (!config.loopback) return; // exit auto play
      
      prepare_loopback_ = false;
      containNode_.classList.add('no-trans');
      waitResetComps_.forEach( function(comp) {
        if (!comp.widget || !comp.isHooked) return;
        
        var mrg = (comp.state.margin || default_margin_).slice(0);
        mrg[0] = comp.oldMarginT || 0; mrg[3] = comp.oldMarginL || 0;
        var sty = {opacity:'',zIndex:(comp.oldZindex || 0)+''};
        sty[TRANS_CSS_NAME] = '';
        
        comp.duals.margin = mrg;
        comp.duals.style = sty;
      });
      
      setTimeout( function() {
        containNode_.classList.remove('no-trans');
        
        slideState = 0; slideHiter = {};
        last_prepost_ = null; last_step_player_ = null;
        pageCtrl.gotoPage(0);
      },300);
    }
    else pageCtrl.gotoPage(pageCtrl.pageIndex + 1);
    
    setTimeout(autoPlaySlide,config.autoplay * 1000);
  }
  
  function tryPausePlayer(player,isJmpPg) {
    var wdgt = player.widget;
    if (wdgt && wdgt.parent) {  // still avaliable
      if (typeof player.stepPause == 'function')
        player.stepPause(isJmpPg);
    }
  }
  
  function trySetPreBuild(comp) {
    var s = comp.state['data-prepost'], ret = '';
    if (!s) return ret;
    
    var b = s.split('-');
    if (b.length >= 2) {
      var index = parseInt(b[0]), iSpeed = parseInt(b[1]);
      if (isNaN(index) || !(iSpeed >= 1 && iSpeed <= 5)) return ret;
      
      comp.oldZindex = parseInt((comp.state.style || {}).zIndex) || 0;
      if (index == 0 || index == 18) {
        if (index == 0 && b.length >= 4) {
          var postIndex = parseInt(b[2]);
          if (postIndex == 13)  // restore
            comp.duals.style = {opacity:'0'};    // hide first
          else if (postIndex == 11 || postIndex == 12) // bring top or push bottom
            comp.duals.style = {opacity:'0.98'}; // let TRANS_END_FUNC can be called
        }
        
        var mrg = comp.state.margin || default_margin_;
        ret = 'prebuild-' + iSpeed;
        comp.oldMarginL = mrg[3];
        comp.oldMarginT = mrg[0];
      }
      else if (index >= 1 && index <= 17) {
        var x = comp.state.left || 0, y = comp.state.top || 0;
        var wd = comp.state.width || 200, hi = comp.state.height || 0;
        if (!hi) {
          var node = comp.getHtmlNode();
          if (node) hi = node.clientHeight || 100;
        }
        var mrg = (comp.state.margin || default_margin_).slice(0);
        var oldLeft = mrg[3], oldTop = mrg[0];
        
        if (index <= 4) {
          if (index == 1)         // enter from top
            mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
          else if (index == 2)    // enter from right
            mrg[3] = SLIDE_HALF_WIDTH - x;
          else if (index == 3)    // enter from bottom
            mrg[0] = SLIDE_HALF_HEIGHT - y;
          else mrg[3] = -SLIDE_HALF_WIDTH - x - wd; // enter from left
          comp.duals.margin = mrg;
          comp.duals.style = {opacity:'0'};
        }
        
        else if (index <= 8) {
          var sty = {opacity:'0'};
          if (index == 5) {         // enter from top-right, rotate
            mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
            mrg[3] = SLIDE_HALF_WIDTH - x;
            sty[TRANS_CSS_NAME] = 'rotate(-215deg) scale(0.2,0.2)';
          }
          else if (index == 6) {    // enter from bottom-right, rotate
            mrg[0] = SLIDE_HALF_HEIGHT - y;
            mrg[3] = SLIDE_HALF_WIDTH - x;
            sty[TRANS_CSS_NAME] = 'rotate(215deg) scale(0.2,0.2)';
          }
          else if (index == 7) {    // enter from bottom-left, rotate
            mrg[0] = SLIDE_HALF_HEIGHT - y;
            mrg[3] = -SLIDE_HALF_WIDTH - x - wd;
            sty[TRANS_CSS_NAME] = 'rotate(-215deg) scale(0.2,0.2)';
          }
          else {  // enter from top-left, rotate
            mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
            mrg[3] = -SLIDE_HALF_WIDTH - x - wd;
            sty[TRANS_CSS_NAME] = 'rotate(215deg) scale(0.2,0.2)';
          }
          comp.duals.margin = mrg;
          comp.duals.style = sty;
        }
        
        else if (index == 9) {
          var sty = {opacity:'0'};
          sty[TRANS_CSS_NAME] = 'scale(0.1,0.1)';
          comp.duals.style = sty;
        }
        else if (index == 10) {
          var sty = {opacity:'0'};
          sty[TRANS_CSS_NAME] = 'rotate(1800deg) scale(0.1,0.1)';
          comp.duals.style = sty;
        }
        else if (index <= 13) {
          if (index == 13)
            comp.duals.style = {opacity:'0'};
          else // index=11:bring to top, index=12:push to bottom, set opacity for TRANS_END_FUNC callback
            comp.duals.style = {opacity:'0.98'};
        }
        else if (index == 14) { // scale from 0.6
          var sty = {};
          sty[TRANS_CSS_NAME] = 'scale(0.6,0.6)';
          comp.duals.style = sty;
        }
        else if (index == 15) { // scale from 0.8
          var sty = {};
          sty[TRANS_CSS_NAME] = 'scale(0.8,0.8)';
          comp.duals.style = sty;
        }
        else if (index == 16) { // scale from 1.2
          var sty = {};
          sty[TRANS_CSS_NAME] = 'scale(1.2,1.2)';
          comp.duals.style = sty;
        }
        else { // index==17, scale from 1.4
          var sty = {};
          sty[TRANS_CSS_NAME] = 'scale(1.4,1.4)';
          comp.duals.style = sty;
        }      // index==18, play
        
        ret = 'prebuild-' + iSpeed;
        comp.oldMarginL = oldLeft;
        comp.oldMarginT = oldTop;
      }
    }
    return ret;
  }
  
  function onSlideLeave() {
    var doAnyBuild = false;
    var wdgt, block, node = this.getHtmlNode();
    if (node && (wdgt=this.widget)) {
      if (last_prepost_) {
        if (last_prepost_.parentNode) { // has last_prepost and still available
          block = last_prepost_.querySelector('.build > .to-build');
          if (block) {
            actToBuild(wdgt,block);
            return false;
          }
          if (trySetPostBuild(wdgt,last_prepost_))
            doAnyBuild = true;
        }
        last_prepost_ = null;
      }
      
      block = node.querySelector('div.rewgt-center > [class*="prebuild-"]');
      if (block) {
        var sPrepost = block.getAttribute('data-prepost') || '';
        if (sPrepost.startsWith('0-')) { // only post-step
          block = null;
          
          var bList = [];
          var blocks = node.querySelectorAll('div.rewgt-center > [class*="prebuild-"]');
          for (var i2=0,block2; block2 = blocks[i2]; i2++) {
            var sPrepost2 = block2.getAttribute('data-prepost') || '';
            if (sPrepost2.startsWith('0-'))
              bList.push(block2);
            else {
              block = block2;
              sPrepost = sPrepost2;
              break;
            }
          }
          
          bList.forEach( function(block) {
            if (trySetPostBuild(wdgt,block))
              doAnyBuild = true;
          });
        }
        
        var sKey = block && utils.keyOfNode(block);
        if (sKey) {
          var childComp = wdgt[sKey];
          childComp = childComp && childComp.component;
          if (childComp && (last_prepost_=childComp.getHtmlNode())) {
            var bSeg = sPrepost.split('-'), sIndex = bSeg[0];
            var sty = {opacity:''};
            var mrg = (childComp.state.margin || default_margin_).slice(0);
            mrg[0] = childComp.oldMarginT || 0;
            mrg[3] = childComp.oldMarginL || 0;
            sty[TRANS_CSS_NAME] = '';
            
            var isPlayer = false;
            if (sIndex == '11')        // bring to top
              sty.zIndex = maxZLevelOfPage(wdgt) + '';
            else if (sIndex == '12')   // push to bottom
              sty.zIndex = minZLevelOfPage(wdgt) + '';
            else if (sIndex == '18') { // play
              isPlayer = true;
              if (typeof childComp.stepPlay == 'function') {
                var iSpeed = parseInt(bSeg[1] || '3');
                childComp.stepPlay(iSpeed); // 3 is normal, 1 is fastest:  1,2,3,4,5
                last_step_player_ = childComp;
              }
            }
            
            if (isPlayer)
              utils.removeClass(childComp,['prebuild-1','prebuild-2','prebuild-3','prebuild-4','prebuild-5']);
            else last_prepost_.addEventListener(TRANS_END_FUNC,getStepEndFunc(true,wdgt),false);
            
            childComp.duals.margin = mrg;
            childComp.duals.style = sty;
            return false;
          }
        }
      }
      
      block = node.querySelector('.build > .to-build');
      if (block) {
        actToBuild(wdgt,block);
        return false;
      }
    }
    
    if (!doAnyBuild && last_step_player_) {
      tryPausePlayer(last_step_player_,false);
      last_step_player_ = null;
    }
    return !doAnyBuild; // return false if has post-step
  }
  
  function getStepEndFunc(isPreStep,slideWdgt) {
    var retFunc = (function(event) {
      var node = event.target;
      node.removeEventListener(TRANS_END_FUNC,retFunc);
      retFunc = null;
      
      var slideNode = slideWdgt.parent && slideWdgt.component;
      slideNode = slideNode && slideNode.getHtmlNode();
      if (!slideNode) return;
      
      var sKey = utils.keyOfNode(node);
      var childComp = sKey && slideWdgt[sKey];
      childComp = childComp && childComp.component;
      if (childComp) {
        if (isPreStep) {
          utils.removeClass(childComp,['prebuild-1','prebuild-2','prebuild-3','prebuild-4','prebuild-5']);
          setTimeout( function() {
            checkJoinedStep(slideNode);
          },300); // ensure prebuild-N removed
        }
        else utils.removeClass(childComp,['postbuild-1','postbuild-2','postbuild-3','postbuild-4','postbuild-5']);
      }
    });
    return retFunc;
  }
  
  function maxZLevelOfPage(wdgt) {
    var iRet = -999, iCount = 0;
    utils.eachElement(wdgt.component, function(child) {
      var comp, sKey = utils.keyOfElement(child);
      if (sKey && (comp=wdgt[sKey])) {
        comp = comp.component;
        if (comp) {
          iCount += 1;
          var index = parseInt(comp.state.style.zIndex || '0');
          if (index > iRet) iRet = index;
        }
      }
    });
    
    if (iCount == 0)
      return 0;
    else if (iRet >= 999)
      return 999;
    else return iRet + 1;
  }
  
  function minZLevelOfPage(wdgt) {
    var iRet = 999, iCount = 0;
    utils.eachElement(wdgt.component, function(child) {
      var comp, sKey = utils.keyOfElement(child);
      if (sKey && (comp=wdgt[sKey])) {
        comp = comp.component;
        if (comp) {
          iCount += 1;
          var index = parseInt(comp.state.style.zIndex || '0');
          if (index < iRet) iRet = index;
        }
      }
    });
    
    if (iCount == 0)
      return 0;
    else if (iRet <= -999)
      return -999;
    else return iRet - 1;
  }
  
  function actToBuild(wdgt,block) {
    var bltNode = block.parentNode;
    var inStatic = bltNode.parentNode.classList.contains('rewgt-static');
    if (!inStatic) {
      var sKey = utils.keyOfNode(bltNode), sKey2 = utils.keyOfNode(block);
      var bltComp = sKey && wdgt[sKey];
      bltComp = bltComp && sKey2 && bltComp[sKey2];
      bltComp = bltComp && bltComp.component;
      if (bltComp) {
        utils.removeClass(bltComp,'to-build');
        return;
      }
    }
    block.classList.remove('to-build');
  }
  
  function trySetPostBuild(wdgt,node) {
    var sKey = utils.keyOfNode(node);
    if (!sKey) return false;
    
    var comp = wdgt[sKey];
    comp = comp && comp.component;
    if (!comp) return false;
    
    var sKlass = (' ' + (comp.state.klass || '')).replace(/\u0020prebuild-[1-5]/g,'');
    var s = comp.state['data-prepost'] || '', b = s.split('-');
    if (b.length >= 4) {
      var index = parseInt(b[2]), iSpeed = parseInt(b[3]);
      if (index >= 1 && index <= 17) {
        if (iSpeed >= 1 && iSpeed <= 5) {
          comp.duals.klass = (sKlass + ' postbuild-' + iSpeed).trim();
          setTimeout( function() { // postbuild-N is added
            node.addEventListener(TRANS_END_FUNC,getStepEndFunc(false,wdgt),false);
            animatePost();
          },300);
          return true;
        }
      }
      else if (index == 18) {    // play, only start, no need join next step
        comp.duals.klass = sKlass.trim();
        if (typeof comp.stepPlay == 'function')
          comp.stepPlay(iSpeed); // 3 is normal, 1 is fastest:  1,2,3,4,5
        return true;
      }
    }
    
    comp.duals.klass = sKlass.trim();  // remove prebuild-N
    return false;
    
    function animatePost() {
      var x = comp.state.left || 0, y = comp.state.top || 0;
      var wd = comp.state.width || 200, hi = comp.state.height || 0;
      if (!hi) hi = node.clientHeight || 100;
      var mrg = (comp.state.margin || default_margin_).slice(0);
      
      if (index <= 4) {
        if (index == 1)         // retired to top
          mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
        else if (index == 2)    // retired to right
          mrg[3] = SLIDE_HALF_WIDTH - x;
        else if (index == 3)    // retired to bottom
          mrg[0] = SLIDE_HALF_HEIGHT - y;
        else mrg[3] = -SLIDE_HALF_WIDTH - x - wd;  // retired to left
        comp.duals.margin = mrg;
        comp.duals.style = {opacity:'0'};
      }
      
      else if (index <= 8) {
        var sty = {opacity:'0'};
        if (index == 5) {       // retired to top-right, rotate
          mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
          mrg[3] = SLIDE_HALF_WIDTH - x;
          sty[TRANS_CSS_NAME] = 'rotate(-215deg) scale(0.2,0.2)';
        }
        else if (index == 6) {  // retired to bottom-right, rotate
          mrg[0] = SLIDE_HALF_HEIGHT - y;
          mrg[3] = SLIDE_HALF_WIDTH - x;
          sty[TRANS_CSS_NAME] = 'rotate(215deg) scale(0.2,0.2)';
        }
        else if (index == 7) {  // retired to bottom-left, rotate
          mrg[0] = SLIDE_HALF_HEIGHT - y;
          mrg[3] = -SLIDE_HALF_WIDTH - x - wd;
          sty[TRANS_CSS_NAME] = 'rotate(-215deg) scale(0.2,0.2)';
        }
        else {  // retired to top-left, rotate
          mrg[0] = -SLIDE_HALF_HEIGHT - y - hi;
          mrg[3] = -SLIDE_HALF_WIDTH - x - wd;
          sty[TRANS_CSS_NAME] = 'rotate(215deg) scale(0.2,0.2)';
        }
        comp.duals.margin = mrg;
        comp.duals.style = sty;
      }
      
      else if (index == 9) {  // scale out, no move, no rotate
        var sty = {opacity:'0'};
        sty[TRANS_CSS_NAME] = 'scale(0.1,0.1)';
        comp.duals.style = sty;
      }
      else if (index == 10) { // rotate scale out, no move
        var sty = {opacity:'0'};
        sty[TRANS_CSS_NAME] = 'rotate(1800deg) scale(0.1,0.1)';
        comp.duals.style = sty;
      }
      
      else if (index <= 13) {
        var sty = {opacity:'0.99'};
        if (index == 11)      // bring to top
          sty.zIndex = maxZLevelOfPage(wdgt) + '';
        else if (index == 12) // push to bottom
          sty.zIndex = minZLevelOfPage(wdgt) + '';
        else sty.zIndex = (comp.oldZindex || 0) + '';  // index == 13, restore
        comp.duals.style = sty;
      }
      else if (index <= 17) {
        var sty = {};
        if (index == 14)      // scale to 0.6
          sty[TRANS_CSS_NAME] = 'scale(0.6,0.6)';
        else if (index == 15) // scale to 0.8
          sty[TRANS_CSS_NAME] = 'scale(0.8,0.8)';
        else if (index == 16) // scale to 1.2
          sty[TRANS_CSS_NAME] = 'scale(1.2,1.2)';
        else sty[TRANS_CSS_NAME] = 'scale(1.4,1.4)';  // scale to 1.4
        comp.duals.style = sty;
      }
    }
  }
});
