webpackJsonp([6],{BjXZ:function(e,t){},Luci:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a={name:"login",data:function(){return{logining:!1,account:{username:"",pwd:""},rules:{username:[{required:!0,message:"请输入账户",trigger:"blur"},{required:!0,trigger:"blur",validator:function(e,t,n){if(!/^(\w){5,15}$/.test(t))return n(new Error("请输入正确格式账户名")),!1;n()}}],pwd:[{required:!0,message:"请输入密码",trigger:"blur"},{required:!0,trigger:"blur",validator:function(e,t,n){if(!/^(\w){8,20}$/.test(t))return n(new Error("请输入正确格式密码")),!1;n()}}]},checked:!1}},methods:{handleLogin:function(){var e=this;this.$refs.AccountFrom.validate(function(t){if(!t)return!1;var n=(new Date).valueOf(),a={Authentication:{UserName:e.account.username,SessionId:""},data:[{CommandType:"Authentication",CommandData:{UserName:e.account.username,Password:e.account.pwd}}],Protocol:{Name:"liguoNetWork",Version:"1.0.0"},JSON:{Version:"1.0.0"},datalen:1,request:n,timestamp:n},o=e;e.$axios.post("/cmd",a).then(function(e){"success"==e.data.status?(sessionStorage.setItem("access_token",e.data.data.Session_id),sessionStorage.setItem("access_username",o.account.username),sessionStorage.setItem("access_priority",e.data.data.Priority),o.$router.push("/"),1==o.checked&&(console.log("checked == true"),o.setCookie(o.account.username,o.account.pwd,7))):"fail"==e.data.status&&alert(e.data.error.errorstring.cn)}).catch(function(e){console.log(e)})})},setCookie:function(e,t,n){var a=new Date;a.setTime(a.getTime()+864e5*n),window.document.cookie="userName="+e+";path=/;expires="+a.toGMTString(),window.document.cookie="userPwd="+t+";path=/;expires="+a.toGMTString()},getCookie:function(){if(document.cookie.length>0)for(var e=document.cookie.split("; "),t=0;t<e.length;t++){var n=e[t].split("=");"userName"==n[0]?this.account.username=n[1]:"userPwd"==n[0]&&(this.account.pwd=n[1])}},clearCookie:function(){this.setCookie("","",-1)}},mounted:function(){this.getCookie()}},o={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e._m(0),e._v(" "),n("div",{staticClass:"login_div"},[n("el-form",{ref:"AccountFrom",staticClass:"demo-ruleForm login-container",attrs:{model:e.account,rules:e.rules,"label-position":"left","label-width":"0px"}},[n("p",{staticClass:"title"},[e._v("利国电子登录")]),e._v(" "),n("el-form-item",{staticClass:"input_box",attrs:{prop:"username"}},[n("el-input",{staticClass:"input_box_style",attrs:{type:"text",maxlength:"15",placeholder:"账号"},model:{value:e.account.username,callback:function(t){e.$set(e.account,"username",t)},expression:"account.username"}})],1),e._v(" "),n("el-form-item",{staticClass:"input_box",attrs:{prop:"pwd"}},[n("el-input",{staticClass:"input_box_style",staticStyle:{"margin-top":"10px"},attrs:{type:"password",maxlength:"20",placeholder:"密码"},nativeOn:{keyup:function(t){return"button"in t||!e._k(t.keyCode,"enter",13,t.key,"Enter")?e.handleLogin(t):null}},model:{value:e.account.pwd,callback:function(t){e.$set(e.account,"pwd",t)},expression:"account.pwd"}})],1),e._v(" "),n("el-form-item",{staticStyle:{width:"250px",height:"30px",margin:"10px auto 10px"}},[n("el-checkbox",{model:{value:e.checked,callback:function(t){e.checked=t},expression:"checked"}},[e._v("记住密码")])],1),e._v(" "),n("el-form-item",{staticClass:"input_box",staticStyle:{"margin-bottom":"30px"}},[n("el-button",{staticStyle:{width:"230px","margin-top":"10px"},attrs:{type:"primary",loading:e.logining},nativeOn:{click:function(t){return t.preventDefault(),e.handleLogin(t)}}},[e._v("登录")])],1)],1)],1)])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"header"},[t("div",{staticClass:"container_fluid"},[this._v("\n            北京市利国电子技术有限公司网络管理系统\n        ")])])}]};var i=n("VU/8")(a,o,!1,function(e){n("BjXZ")},"data-v-283d497d",null);t.default=i.exports}});
//# sourceMappingURL=6.65aec9cade1d94ad2802.js.map