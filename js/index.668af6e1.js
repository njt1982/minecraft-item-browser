(function(e){function t(t){for(var n,a,c=t[0],o=t[1],u=t[2],d=0,p=[];d<c.length;d++)a=c[d],Object.prototype.hasOwnProperty.call(s,a)&&s[a]&&p.push(s[a][0]),s[a]=0;for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n]);l&&l(t);while(p.length)p.shift()();return r.push.apply(r,u||[]),i()}function i(){for(var e,t=0;t<r.length;t++){for(var i=r[t],n=!0,c=1;c<i.length;c++){var o=i[c];0!==s[o]&&(n=!1)}n&&(r.splice(t--,1),e=a(a.s=i[0]))}return e}var n={},s={index:0},r=[];function a(t){if(n[t])return n[t].exports;var i=n[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,a),i.l=!0,i.exports}a.m=e,a.c=n,a.d=function(e,t,i){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(a.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(i,n,function(t){return e[t]}.bind(null,n));return i},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/minecraft-item-browser/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],o=c.push.bind(c);c.push=t,c=c.slice();for(var u=0;u<c.length;u++)t(c[u]);var l=o;r.push([0,"chunk-vendors"]),i()})({0:function(e,t,i){e.exports=i("56d7")},"56d7":function(e,t,i){"use strict";i.r(t);i("e260"),i("e6cf"),i("cca6"),i("a79d");var n=i("2b0e"),s=(i("4989"),function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"app"}},[i("router-view")],1)}),r=[],a={name:"app"},c=a,o=(i("5c0b"),i("2877")),u=Object(o["a"])(c,s,r,!1,null,null,null),l=u.exports,d=i("8c4f"),p=i("0284"),m=i.n(p),f=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"container"},[i("div",{staticClass:"row"},[i("Sidebar",{attrs:{results:e.results},on:{runSearch:e.updateQuery}}),i("ResultView",{attrs:{item:e.selectedItem}})],1)])},h=[],g=(i("4de4"),i("4d63"),i("ac1f"),i("25f0"),function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"col-md-3 mb-4"},[i("h4",[e._v("Search")]),i("div",{staticClass:"form-group"},[i("div",{staticClass:"input-group"},[e._m(0),i("input",{directives:[{name:"model",rawName:"v-model",value:e.mutableQuery,expression:"mutableQuery"}],staticClass:"form-control",attrs:{type:"search",placeholder:"Search"},domProps:{value:e.mutableQuery},on:{input:[function(t){t.target.composing||(e.mutableQuery=t.target.value)},e.runSearch]}})])]),i("h4",[e._v("Results")]),i("div",{staticClass:"list-group",attrs:{id:"search_results"}},e._l(e.results,(function(e){return i("Item",{key:e.id,staticClass:"list-group-item",attrs:{item:e,"show-name":!0}})})),1),i("button",{staticClass:"btn btn-danger mt-4",on:{click:e.resetDb}},[e._v(" Clear Cached DB ")])])}),b=[function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"input-group-prepend"},[i("span",{staticClass:"input-group-text"},[i("i",{staticClass:"fa fa-search",attrs:{"aria-hidden":"true"}})])])}],v=i("b047"),_=i.n(v),y=(i("d3b7"),i("3ca3"),i("ddb0"),i("4dec")),w=new y["a"]("minecraft");w.version(1).stores({items:"++id, &name, displayName, texture",recipes:"++id, *ingredients, *result.id, type, inShape, base, addition, result"}),w.open(),w.on("ready",(function(){return w.items.count((function(e){if(e>0)console.log("Already populated");else{console.log("Database is empty. Populating from ajax call...");var t=new Promise((function(e,t){$.ajax("/minecraft-item-browser/js/items.json",{type:"get",dataType:"json",error:function(e,i){t(i)},success:function(t){e(t)}})})),i=new Promise((function(e,t){$.ajax("/minecraft-item-browser/js/recipes.json",{type:"get",dataType:"json",error:function(e,i){t(i)},success:function(t){e(t)}})}));new Promise.all([t,i]).then((function(e){return console.log("Got ajax response. Adding objects.",e),console.log("Calling bulkAdd() to insert objects..."),new Promise.all([w.items.bulkAdd(e[0]),w.recipes.bulkAdd(e[1])]).then((function(){return location.reload()}))})).then((function(){console.log("Done populating.")}))}}))}));var C=w,I=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("router-link",{staticClass:"item-link",attrs:{to:{name:"Home",params:{item_name:e.item.name}},"data-item-id":e.item.id}},[i("img",{staticClass:"mc-block",attrs:{src:e.textureSrc(),alt:e.item.displayName}}),e.showName?i("span",{staticClass:"text-muted"},[e._v(e._s(e.item.displayName))]):e._e()])},j=[],x={props:{item:Object,showName:{type:Boolean,default:!1}},methods:{textureSrc:function(){return"data:image/png;base64,"+this.item.texture}},mounted:function(){this.showName||$(this.$el).tooltip({title:this.item.displayName,position:"top"})},beforeDestroy:function(){$(this.$el).tooltip("dispose")}},k=x,O=Object(o["a"])(k,I,j,!1,null,null,null),S=O.exports,P={props:{results:Array},components:{Item:S},created:function(){if(this.$route.params.item_name){var e=this;C.items.get({name:this.$route.params.item_name}).then((function(t){e.mutableQuery=t?t.displayName:e.$route.params.item_name,e.$emit("runSearch",e.mutableQuery)}))}},data:function(){return{mutableQuery:""}},computed:{runSearch:function(){return _()((function(e){this.$emit("runSearch",e.srcElement.value)}),50).bind(this)}},methods:{resetDb:function(){C.delete(),location.reload()}}},N=P,A=Object(o["a"])(N,g,b,!1,null,null,null),R=A.exports,E=function(){var e=this,t=e.$createElement,i=e._self._c||t;return e.item?i("div",{staticClass:"col-md-9"},[i("h1",{staticClass:"mb-5"},[e._v(e._s(e.item.displayName))]),e.created_by.length?i("div",{staticClass:"mb-4"},[i("h2",[e._v("Created By")]),i("div",{staticClass:"row"},e._l(e.created_by,(function(t){return i("Recipe",{key:t.id,attrs:{recipe:t,suggestedInput:e.item}})})),1)]):e._e(),e.used_id.length?i("div",{staticClass:"mb-4"},[i("h2",[e._v("Used In")]),i("div",{staticClass:"row"},e._l(e.used_id,(function(t){return i("Recipe",{key:t.id,attrs:{recipe:t,suggestedInput:e.item,showHeader:"",showFooter:""}})})),1)]):e._e(),e.creates.length?i("div",{staticClass:"mb-4"},[i("h2",[e._v("Creates")]),i("div",{staticClass:"row"},e._l(e.creates,(function(t){return i("Recipe",{key:t.id,attrs:{recipe:t,suggestedInput:e.item}})})),1)]):e._e()]):i("div",{staticClass:"col-md-9"},[i("p",[e._v("Do a search and select an item.")])])},Q=[],T=(i("b0c0"),function(){var e=this,t=e.$createElement,i=e._self._c||t;return e.isReady?i("div",{staticClass:"col-6 col-xl-4 mb-3"},[i("div",{staticClass:"card recipe"},[e.showHeader?i("div",{staticClass:"card-header"},[i("h4",{staticClass:"mb-0"},[e._v(e._s(e.createsItem.displayName))])]):e._e(),i("div",{staticClass:"card-body d-flex"},[e.inputGrid?i("div",{staticClass:"input-recipe"},e._l(e.inputGrid,(function(t,n){return i("div",{key:n},e._l(t,(function(t,n){return i("span",{key:n,staticClass:"invslot"},[null!=t?i("Item",{attrs:{item:e.getIngredientItem(t)}}):e._e()],1)})),0)})),0):e._e(),i("i",{staticClass:"fa fa-chevron-right"}),i("span",{staticClass:"result"},[i("Item",{staticClass:"invslot",attrs:{item:e.createsItem}}),e.recipe.result.count>1?i("span",{staticClass:"count"},[e._v(" "+e._s(e.recipe.result.count)+" ")]):e._e()],1)]),e.showFooter?i("div",{staticClass:"card-footer"},[i("Item",{attrs:{item:this.craftingTableItem,"show-name":!0}})],1):e._e()])]):e._e()}),D=[],B=(i("7db0"),i("c975"),{props:{recipe:Object,showHeader:{type:Boolean,default:!1},showFooter:{type:Boolean,default:!1},suggestedInput:{type:Object,default:void 0}},components:{Item:S},data:function(){return{createsItem:void 0,loadedIngredients:void 0,craftingTableItem:void 0}},computed:{isReady:function(){return void 0!=this.createsItem&&void 0!=this.loadedIngredients&&void 0!=this.craftingTableItem},inputGrid:function(){var e=[[]];if("crafting_shaped"===this.recipe.type||"crafting_shapeless"===this.recipe.type){e=[[],[],[]];for(var t=0;t<9;t++){var i=Math.floor(t/3),n=t%3;this.recipe.inShape?this.recipe.inShape[i]?e[i][n]=this.recipe.inShape[i][n]:e[i][n]=null:this.recipe.ingredients&&(e[i][n]=this.recipe.ingredients[t])}}else"smelting"===this.recipe.type||"blasting"===this.recipe.type||"smoking"===this.recipe.type||"campfire_cooking"===this.recipe.type||"stonecutting"===this.recipe.type?(e=[[]],this.suggestedInput&&-1!==this.recipe.ingredients.indexOf(this.suggestedInput.id)?e[0][0]=this.suggestedInput.id:e[0][0]=this.recipe.ingredients[0]):"smithing"==this.recipe.type&&(e=[[this.recipe.base,this.recipe.addition]]);return e}},methods:{getIngredientItem:function(e){return this.loadedIngredients.find((function(t){return t.id==e}))}},created:function(){var e=this,t={crafting_shapeless:"crafting_table",crafting_shaped:"crafting_table",smelting:"furnace",stonecutting:"stonecutter",smithing:"smithing_table",blasting:"blast_furnace",smoking:"smoker",campfire_cooking:"campfire"};C.items.get({name:t[this.recipe.type]}).then((function(t){e.craftingTableItem=t})),C.items.get(this.recipe.result.id).then((function(t){e.createsItem=t})),C.items.bulkGet(this.recipe.ingredients).then((function(t){e.loadedIngredients=t}))}}),G=B,H=Object(o["a"])(G,T,D,!1,null,null,null),M=H.exports,q={props:{item:Object},components:{Recipe:M},data:function(){return{created_by:[],used_id:[],creates:[]}},watch:{item:function(e){var t={crafting_table:["crafting_shapeless","crafting_shaped"],furnace:["smelting"],stonecutter:["stonecutting"],smithing_table:["smithing"],blast_furnace:["blasting"],smoker:["smoking"],campfire:["campfire_cooking"]},i=this;C.recipes.where("result.id").equals(e.id).toArray().then((function(e){i.created_by=e})),C.recipes.where("ingredients").equals(e.id).toArray().then((function(e){i.used_id=e})),t[e.name]?C.recipes.where("type").anyOf(t[e.name]).toArray().then((function(e){i.creates=e})):this.creates=[]}}},F=q,J=Object(o["a"])(F,E,Q,!1,null,null,null),U=J.exports,V={components:{Sidebar:R,ResultView:U},data:function(){return{results:[],selectedItem:void 0}},methods:{updateQuery:function(e){if(e.length){var t=this,i=new RegExp(e,"i");C.items.filter((function(e){return i.test(e.displayName)})).limit(10).toArray().then((function(e){t.results=e}))}else this.results=[]}},watch:{"$route.params":{immediate:!0,handler:function(e){var t=this;e.item_name&&C.items.where("name").equals(e.item_name).first().then((function(e){e&&(t.selectedItem=e)}))}}}},z=V,K=Object(o["a"])(z,f,h,!1,null,null,null),L=K.exports;n["a"].use(d["a"]);var W=new d["a"]({base:"/minecraft-item-browser/",routes:[{path:"/:item_name?",name:"Home",component:L,props:!0}]});n["a"].use(m.a,{id:"UA-527778-21",router:W});var X=W;window.$=i("1157"),n["a"].config.productionTip=!1,new n["a"]({router:X,render:function(e){return e(l)}}).$mount("#app")},"5c0b":function(e,t,i){"use strict";var n=i("9c0c"),s=i.n(n);s.a},"9c0c":function(e,t,i){}});
//# sourceMappingURL=index.668af6e1.js.map