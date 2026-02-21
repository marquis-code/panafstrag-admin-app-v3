import { _ as __nuxt_component_1 } from './Logo-Djpriep9.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-CX85iufL.mjs';
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useAuth } from './useAuth-B5P4vKBX.mjs';
import { u as useHead } from './composables-BKrvPIF0.mjs';
import './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './useApi-WHzNNEGF.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuth();
    const form = reactive({
      email: "",
      password: ""
    });
    const loading = ref(false);
    const error = ref("");
    useHead({
      title: "Login | PANAFSTRAG"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Logo = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-md mx-auto py-20" }, _attrs))}><div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-10 shadow-2xl"><div class="text-center mb-10">`);
      _push(ssrRenderComponent(_component_Logo, { class: "justify-center mb-6" }, null, _parent));
      _push(`<h1 class="text-3xl font-black tracking-tight">Welcome Back</h1><p class="text-slate-500 text-sm font-bold mt-2">Log in to your account</p></div><form class="space-y-6"><div><label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label><input${ssrRenderAttr("value", unref(form).email)} type="email" required placeholder="name@example.com" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"></div><div><label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" required placeholder="••••••••" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"></div>`);
      if (unref(error)) {
        _push(`<div class="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl text-center">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:translate-y-0">${ssrInterpolate(unref(loading) ? "LOGGING IN..." : "LOG IN")}</button></form><div class="mt-8 text-center"><p class="text-slate-500 text-sm font-bold"> Don&#39;t have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "text-indigo-600 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Register here`);
          } else {
            return [
              createTextVNode("Register here")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-CsYe5Yos.mjs.map
