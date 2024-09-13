var defaultPosts=elementorModules.frontend.handlers.Base.extend({getSkinPrefix:()=>"vamtam_classic_",bindEvents(){elementorFrontend.addListenerOnce(this.getModelCID(),"resize",this.onWindowResize)},unbindEvents(){elementorFrontend.removeListeners(this.getModelCID(),"resize",this.onWindowResize)},getClosureMethodsNames(){return elementorModules.frontend.handlers.Base.prototype.getClosureMethodsNames.apply(this,arguments).concat(["fitImages","onWindowResize","runMasonry"])},getDefaultSettings:()=>({classes:{fitHeight:"elementor-fit-height",hasItemRatio:"elementor-has-item-ratio"},selectors:{postsContainer:".elementor-posts-container",post:".elementor-post",postThumbnail:".elementor-post__thumbnail",postThumbnailImage:".elementor-post__thumbnail img"}}),getDefaultElements(){var e=this.getSettings("selectors");return{$postsContainer:this.$element.find(e.postsContainer),$posts:this.$element.find(e.post)}},fitImage(e){var t=this.getSettings(),s=e.find(t.selectors.postThumbnail),n=s.find("img")[0];if(n){var i=s.outerHeight()/s.outerWidth(),o=n.naturalHeight/n.naturalWidth;s.toggleClass(t.classes.fitHeight,o<i)}},fitImages(){var e=jQuery,t=this,s=getComputedStyle(this.$element[0],":after").content,n=this.getSettings();if(t.isMasonryEnabled()){this.elements.$postsContainer.removeClass(n.classes.hasItemRatio);return}this.elements.$postsContainer.toggleClass(n.classes.hasItemRatio,!!s.match(/\d/)),this.elements.$posts.each(function(){var s=e(this),i=s.find(n.selectors.postThumbnailImage);t.fitImage(s),i.on("load",function(){t.fitImage(s)})})},setColsCountSettings(){let e=this.getElementSettings(),t=this.getSkinPrefix(),s=elementorProFrontend.utils.controls.getResponsiveControlValue(e,`${t}columns`);this.setSettings("colsCount",s)},isMasonryEnabled(){return!!this.getElementSettings(this.getSkinPrefix()+"masonry")},initMasonry(){imagesLoaded(this.elements.$posts,this.runMasonry)},getVerticalSpaceBetween(){let e=elementorProFrontend.utils.controls.getResponsiveControlValue(this.getElementSettings(),`${this.getSkinPrefix()}row_gap`,"size");return""===this.getSkinPrefix()&&""===e&&(e=this.getElementSettings("item_gap.size")),e},runMasonry(){var e=this.elements;e.$posts.css({marginTop:"",transitionDuration:""}),this.setColsCountSettings();var t=this.getSettings("colsCount"),s=this.isMasonryEnabled()&&t>=2;if(e.$postsContainer.toggleClass("elementor-posts-masonry",s),!s){e.$postsContainer.height("");return}let n=this.getVerticalSpaceBetween();new elementorModules.utils.Masonry({container:e.$postsContainer,items:e.$posts.filter(":visible"),columnsCount:this.getSettings("colsCount"),verticalSpaceBetween:n||0}).run()},run(){setTimeout(this.fitImages,0),this.initMasonry()},onInit(){elementorModules.frontend.handlers.Base.prototype.onInit.apply(this,arguments),this.bindEvents(),this.run()},onWindowResize(){this.fitImages(),this.runMasonry()},onElementChange(){this.fitImages(),setTimeout(this.runMasonry)}});class VamtamLoadMore extends elementorModules.frontend.handlers.Base{getDefaultSettings(){return{selectors:{postsContainer:".elementor-posts-container",loadMoreButton:".elementor-button",loadMoreSpinnerWrapper:".e-load-more-spinner",loadMoreSpinner:".e-load-more-spinner i, .e-load-more-spinner svg",loadMoreAnchor:".e-load-more-anchor"},classes:{loadMoreSpin:"eicon-animation-spin",loadMoreIsLoading:"e-load-more-pagination-loading",loadMorePaginationEnd:"e-load-more-pagination-end",loadMoreNoSpinner:"e-load-more-no-spinner"}}}getDefaultElements(){let e=this.getSettings("selectors");return{postsWidgetWrapper:this.$element[0],postsContainer:this.$element[0].querySelector(e.postsContainer),loadMoreButton:this.$element[0].querySelector(e.loadMoreButton),loadMoreSpinnerWrapper:this.$element[0].querySelector(e.loadMoreSpinnerWrapper),loadMoreSpinner:this.$element[0].querySelector(e.loadMoreSpinner),loadMoreAnchor:this.$element[0].querySelector(e.loadMoreAnchor)}}bindEvents(){super.bindEvents(),this.elements.loadMoreButton&&this.elements.loadMoreButton.addEventListener("click",e=>{!this.isLoading&&(e.preventDefault(),this.handlePostsQuery())})}onInit(){super.onInit(),this.classes=this.getSettings("classes"),this.isLoading=!1;let e=this.getElementSettings("pagination_type");("load_more_on_click"===e||"load_more_infinite_scroll"===e)&&(this.isInfinteScroll="load_more_infinite_scroll"===e,this.isSpinnerAvailable=this.getElementSettings("load_more_spinner").value,this.isSpinnerAvailable||this.elements.postsWidgetWrapper.classList.add(this.classes.loadMoreNoSpinner),this.isInfinteScroll?this.handleInfiniteScroll():this.elements.loadMoreSpinnerWrapper&&this.elements.loadMoreButton&&this.elements.loadMoreButton.insertAdjacentElement("beforeEnd",this.elements.loadMoreSpinnerWrapper),this.elementId=this.getID(),this.postId=elementorFrontendConfig.post.id,this.elements.loadMoreAnchor&&(this.currentPage=parseInt(this.elements.loadMoreAnchor.getAttribute("data-page")),this.maxPage=parseInt(this.elements.loadMoreAnchor.getAttribute("data-max-page")),this.currentPage!==this.maxPage&&this.currentPage||this.handleUiWhenNoPosts()))}handleInfiniteScroll(){!this.isEdit&&(this.observer=elementorModules.utils.Scroll.scrollObserver({callback:e=>{e.isInViewport&&!this.isLoading&&(this.observer.unobserve(this.elements.loadMoreAnchor),this.handlePostsQuery().then(()=>{this.currentPage!==this.maxPage&&this.observer.observe(this.elements.loadMoreAnchor)}))}}),this.observer.observe(this.elements.loadMoreAnchor))}handleUiBeforeLoading(){this.isLoading=!0,this.elements.loadMoreSpinner&&this.elements.loadMoreSpinner.classList.add(this.classes.loadMoreSpin),this.elements.postsWidgetWrapper.classList.add(this.classes.loadMoreIsLoading)}handleUiAfterLoading(){this.isLoading=!1,this.elements.loadMoreSpinner&&this.elements.loadMoreSpinner.classList.remove(this.classes.loadMoreSpin),this.isInfinteScroll&&this.elements.loadMoreSpinnerWrapper&&this.elements.loadMoreAnchor&&this.elements.loadMoreAnchor.insertAdjacentElement("afterend",this.elements.loadMoreSpinnerWrapper),this.elements.postsWidgetWrapper.classList.remove(this.classes.loadMoreIsLoading)}handleUiWhenNoPosts(){this.elements.postsWidgetWrapper.classList.add(this.classes.loadMorePaginationEnd)}handleSuccessFetch(e){this.handleUiAfterLoading();let t=e.querySelectorAll(`[data-id="${this.elementId}"] .elementor-posts-container > article`),s=e.querySelector(".e-load-more-anchor").getAttribute("data-next-page"),n=[...t].reduce((e,t)=>e+t.outerHTML,"");this.elements.postsContainer.insertAdjacentHTML("beforeend",n),this.elements.loadMoreAnchor.setAttribute("data-page",this.currentPage),this.elements.loadMoreAnchor.setAttribute("data-next-page",s),this.currentPage===this.maxPage&&this.handleUiWhenNoPosts(),setTimeout(()=>{jQuery(window).trigger("resize")},10)}handlePostsQuery(){this.handleUiBeforeLoading(),this.currentPage++;let e=new URL(this.elements.loadMoreAnchor.getAttribute("data-next-page"));return e.searchParams.set("vamtam_posts_fetch",1),fetch(e.toString()).then(e=>e.text()).then(e=>{let t=new DOMParser,s=t.parseFromString(e,"text/html");this.handleSuccessFetch(s)}).catch(e=>{console.warn("Something went wrong.",e)})}}class VamtamMasonry extends elementorModules.frontend.handlers.Base{onInit(){elementorModules.frontend.handlers.Base.prototype.onInit.apply(this,arguments),this.bindEvents(),this.loadMoreMasonryFix(),this.checkApplySafariFix()}checkApplySafariFix(){let e=this;jQuery(window).on("load",()=>{jQuery("html").hasClass("safari")&&setTimeout(()=>{e.onWindowResize()},10)})}recalculateMasonry(){this.elements=this.getDefaultElements(),this.onWindowResize()}checkDiscardDuplicates(){let e=this.$element,t=e.find(".elementor-posts-container"),s=t.find(".elementor-post:visible"),n=jQuery(".vamtam-blog-featured-post .elementor-post:visible"),i=[],o=[],a=0;if(s.length){if(jQuery.each(s,(e,t)=>{let n=parseInt(s[e].classList[2].match(/\d+/)[0]);n&&!isNaN(n)&&(-1===i.indexOf(n)?i.push(n):(jQuery(t).remove(),a++))}),n.length){jQuery.each(n,e=>{let t=parseInt(n[e].classList[2].match(/\d+/)[0]);t&&!isNaN(t)&&-1===o.indexOf(t)&&o.push(t)});let r=t.find(".elementor-post:visible");jQuery.each(r,(e,t)=>{let s=parseInt(r[e].classList[2].match(/\d+/)[0]);s&&!isNaN(s)&&-1!==o.indexOf(s)&&(jQuery(t).remove(),a++)})}return a}}loadMoreMasonryFix(){let e=this.getElementSettings().pagination_type;if("load_more_on_click"!==e&&"load_more_infinite_scroll"!==e)return;var t=this.$element,s=t.find(".elementor-posts-container"),n=t.find(".elementor-button"),i=t.find(".e-load-more-anchor"),o=null,a=null,r=null,l=this;let h=()=>{"load_more_on_click"===e?jQuery(n).off("click",d):r.disconnect()},d=()=>{o=s.find(".elementor-post:visible").length;let e=!1,n=setInterval(()=>{if(o!==(a=s.find(".elementor-post:visible").length)){let d=l.checkDiscardDuplicates();l.recalculateMasonry(),o=a-d,clearInterval(n),e=!0,r&&r.observe(i[0])}t.hasClass("e-load-more-pagination-end")&&h()},50);e||setTimeout(()=>{clearInterval(n)},1e4)};"load_more_on_click"===e?jQuery(n).on("click",d):(()=>{!this.isEdit&&(r=elementorModules.utils.Scroll.scrollObserver({callback(e){e.isInViewport&&(r.unobserve(i[0]),d())}})).observe(i[0])})()}getSkinPrefix(){if(this.skinPrefix)return this.skinPrefix;let e=this.getSettings()?.elementName?.split(".")[1];return e?(this.skinPrefix=e+"_",this.skinPrefix):"vamtam_classic_"}bindEvents(){var e=this.getModelCID();elementorFrontend.addListenerOnce(e,"resize",this.onWindowResize.bind(this))}getClosureMethodsNames(){return elementorModules.frontend.handlers.Base.prototype.getClosureMethodsNames.apply(this,arguments).concat(["fitImages","onWindowResize","runMasonry"])}getDefaultSettings(){return{classes:{fitHeight:"elementor-fit-height",hasItemRatio:"elementor-has-item-ratio"},selectors:{postsContainer:".elementor-posts-container",post:".elementor-post",postThumbnail:".elementor-post__thumbnail",postThumbnailImage:".elementor-post__thumbnail img"}}}getDefaultElements(){var e=this.getSettings("selectors");return{$postsContainer:this.$element.find(e.postsContainer),$posts:this.$element.find(e.post)}}fitImage(e){var t=this.getSettings(),s=e.find(t.selectors.postThumbnail),n=s.find("img")[0];if(n){var i=s.outerHeight()/s.outerWidth(),o=n.naturalHeight/n.naturalWidth;s.toggleClass(t.classes.fitHeight,o<i)}}fitImages(){var e=jQuery,t=this,s=getComputedStyle(this.$element[0],":after").content,n=this.getSettings();this.elements.$postsContainer.toggleClass(n.classes.hasItemRatio,!!s.match(/\d/)),!t.isMasonryEnabled()&&this.elements.$posts.each(function(){var s=e(this),i=s.find(n.selectors.postThumbnailImage);t.fitImage(s),i.on("load",function(){t.fitImage(s)})})}setColsCountSettings(){var e,t=elementorFrontend.getCurrentDeviceMode(),s=this.getElementSettings(),n=this.getSkinPrefix();switch(t){case"mobile":e=s[n+"columns_mobile"];break;case"tablet":e=s[n+"columns_tablet"];break;default:e=s[n+"columns"]}this.setSettings("colsCount",e)}isMasonryEnabled(){return!!this.getElementSettings(this.getSkinPrefix()+"masonry")}runMasonry(){var e=this.elements;e.$posts.css({marginTop:"",transitionDuration:""}),this.setColsCountSettings();var t=this.getSettings("colsCount"),s=this.isMasonryEnabled()&&t>=2;if(e.$postsContainer.toggleClass("elementor-posts-masonry",s),!s){e.$postsContainer.height("");return}var n=this.getElementSettings(this.getSkinPrefix()+"row_gap.size");""===this.getSkinPrefix()&&""===n&&(n=this.getElementSettings(this.getSkinPrefix()+"item_gap.size")),new elementorModules.utils.Masonry({container:e.$postsContainer,items:e.$posts.filter(":visible"),columnsCount:this.getSettings("colsCount"),verticalSpaceBetween:n}).run()}onWindowResize(){this.fitImages(),this.runMasonry()}}jQuery(window).on("elementor/frontend/init",()=>{if(elementorFrontend.elementsHandler&&elementorFrontend.elementsHandler.attachHandler)VAMTAM_FRONT.elementor.widgets.isWidgetModActive("posts")&&(elementorFrontend.elementsHandler.attachHandler("posts",defaultPosts,"vamtam_classic"),elementorFrontend.elementsHandler.attachHandler("posts",VamtamLoadMore,"vamtam_classic"),elementorFrontend.elementsHandler.attachHandler("posts",VamtamMasonry,"vamtam_classic"),elementorFrontend.elementsHandler.attachHandler("posts",VamtamMasonry,"classic")),VAMTAM_FRONT.elementor.widgets.isWidgetModActive("archive-posts")&&(elementorFrontend.elementsHandler.attachHandler("archive-posts",defaultPosts,"vamtam_classic"),elementorFrontend.elementsHandler.attachHandler("archive-posts",VamtamLoadMore,"vamtam_classic"),elementorFrontend.elementsHandler.attachHandler("archive-posts",VamtamMasonry,"vamtam_classic"),elementorFrontend.elementsHandler.attachHandler("archive-posts",VamtamMasonry,"archive_classic"));else{let e=e=>{elementorFrontend.elementsHandler.addHandler(defaultPosts,{$element:e})},t=e=>{elementorFrontend.elementsHandler.addHandler(VamtamLoadMore,{$element:e})},s=e=>{elementorFrontend.elementsHandler.addHandler(VamtamMasonry,{$element:e})};VAMTAM_FRONT.elementor.widgets.isWidgetModActive("posts")&&(elementorFrontend.hooks.addAction("frontend/element_ready/posts.vamtam_classic",e,100),elementorFrontend.hooks.addAction("frontend/element_ready/posts.vamtam_classic",t,100),elementorFrontend.hooks.addAction("frontend/element_ready/posts.vamtam_classic",s,100),elementorFrontend.hooks.addAction("frontend/element_ready/posts.classic",s,100)),VAMTAM_FRONT.elementor.widgets.isWidgetModActive("archive-posts")&&(elementorFrontend.hooks.addAction("frontend/element_ready/archive-posts.vamtam_classic",e,100),elementorFrontend.hooks.addAction("frontend/element_ready/archive-posts.vamtam_classic",t,100),elementorFrontend.hooks.addAction("frontend/element_ready/archive-posts.vamtam_classic",s,100),elementorFrontend.hooks.addAction("frontend/element_ready/archive-posts.classic",s,100))}});
