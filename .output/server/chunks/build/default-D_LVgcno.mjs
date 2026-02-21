import { _ as __nuxt_component_0 } from './nuxt-link-CX85iufL.mjs';
import { _ as __nuxt_component_1 } from './Logo-Djpriep9.mjs';
import { ref, mergeProps, withCtx, createVNode, createTextVNode, toDisplayString, unref, defineComponent, watch, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { io } from 'socket.io-client';
import { b as useRuntimeConfig } from './server.mjs';
import { u as useAuth } from './useAuth-B5P4vKBX.mjs';
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

const useChat = () => {
  const config = useRuntimeConfig();
  const { user } = useAuth();
  const socket = ref(null);
  const messages = ref([]);
  const isConnected = ref(false);
  const connect = () => {
    if (socket.value) return;
    socket.value = io(`${config.public.apiBase}/chat`, {
      transports: ["websocket"]
    });
    socket.value.on("connect", () => {
      isConnected.value = true;
      socket.value?.emit("findAllMessages", {}, (data) => {
        messages.value = data;
      });
    });
    socket.value.on("disconnect", () => {
      isConnected.value = false;
    });
    socket.value.on("newMessage", (message) => {
      messages.value.push(message);
    });
  };
  const sendMessage = (content) => {
    if (!socket.value || !user.value) return;
    socket.value.emit("sendMessage", {
      sender: user.value._id,
      content
    });
  };
  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };
  return {
    messages,
    isConnected,
    connect,
    sendMessage,
    disconnect
  };
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ChatWidget",
  __ssrInlineRender: true,
  setup(__props) {
    const { messages } = useChat();
    const { user } = useAuth();
    const isOpen = ref(false);
    const newMessage = ref("");
    const messageContainer = ref(null);
    const scrollToBottom = () => {
      nextTick(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
      });
    };
    watch(messages, () => {
      scrollToBottom();
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed bottom-8 right-8 z-[100] flex flex-col items-end" }, _attrs))}>`);
      if (unref(isOpen)) {
        _push(`<div class="w-[24rem] h-[32rem] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden mb-6"><div class="px-8 py-6 bg-indigo-600 text-white flex items-center justify-between"><div class="flex items-center gap-3"><div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div><h3 class="font-black text-lg">Community Chat</h3></div><button class="p-1 hover:bg-white/20 rounded-lg transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></button></div><div class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950/50"><!--[-->`);
        ssrRenderList(unref(messages), (msg) => {
          _push(`<div class="${ssrRenderClass(["flex flex-col", msg.sender._id === unref(user)?._id ? "items-end" : "items-start"])}"><div class="${ssrRenderClass(["max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm", msg.sender._id === unref(user)?._id ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none"])}">${ssrInterpolate(msg.content)}</div><span class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">${ssrInterpolate(msg.sender.name)}</span></div>`);
        });
        _push(`<!--]--></div><div class="p-4 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800"><div class="flex gap-2"><input${ssrRenderAttr("value", unref(newMessage))} placeholder="Type your message..." class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"><button class="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg></button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:-translate-y-2 active:scale-90 transition-all group overflow-hidden relative"><div class="absolute inset-0 bg-white/10 group-hover:scale-150 transition-transform duration-700 rounded-full blur-xl"></div>`);
      if (!unref(isOpen)) {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>`);
      } else {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`);
      }
      _push(`</button></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ChatWidget.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "ChatWidget" });
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const isMobileMenuOpen = ref(false);
    const navItems = [
      { label: "Dashboard", path: "/" },
      { label: "Board", path: "/board" },
      { label: "Cells", path: "/cells" },
      { label: "Programs", path: "/programs" },
      { label: "Archives", path: "/archives" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Logo = __nuxt_component_1;
      const _component_ChatWidget = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans" }, _attrs))}><header class="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"><nav class="container mx-auto px-4 h-20 flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "hover:opacity-90 transition-opacity"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Logo, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Logo)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="hidden lg:flex items-center gap-8"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.path,
          to: item.path,
          class: "text-sm font-semibold hover:text-indigo-600 transition-colors",
          "active-class": "text-indigo-600"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(item.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="flex items-center gap-4"><button class="lg:hidden p-2 text-slate-600 dark:text-slate-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div></nav>`);
      if (unref(isMobileMenuOpen)) {
        _push(`<div class="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 shadow-xl"><div class="flex flex-col gap-4"><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.path,
            to: item.path,
            class: "text-lg font-bold hover:text-indigo-600 transition-colors",
            onClick: ($event) => isMobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main class="container mx-auto px-4 py-12">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12"><div class="container mx-auto px-4"><div class="flex flex-col md:flex-row justify-between items-center gap-8">`);
      _push(ssrRenderComponent(_component_Logo, null, null, _parent));
      _push(`<p class="text-slate-500 dark:text-slate-400 text-sm"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} PANAFSTRAG. All rights reserved. </p><div class="flex gap-6"><a href="#" class="text-slate-400 hover:text-indigo-600 transition-colors">Twitter</a><a href="#" class="text-slate-400 hover:text-indigo-600 transition-colors">LinkedIn</a></div></div></div></footer>`);
      _push(ssrRenderComponent(_component_ChatWidget, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-D_LVgcno.mjs.map
