import { ssrRenderTeleport, ssrInterpolate, ssrRenderSlot, ssrRenderAttrs, ssrRenderClass, ssrRenderAttr } from 'vue/server-renderer';
import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { u as useApi } from './useApi-WHzNNEGF.mjs';

const _sfc_main$1 = {
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    show: Boolean,
    title: String
  },
  emits: ["close"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.show) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">`);
          if (__props.show) {
            _push2(`<div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"><div class="px-10 py-8 flex items-center justify-between border-b border-slate-50 dark:border-slate-800"><h3 class="text-2xl font-black tracking-tight">${ssrInterpolate(__props.title)}</h3><button class="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="px-10 py-10 max-h-[70vh] overflow-y-auto">`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
            _push2(`</div>`);
            if (_ctx.$slots.actions) {
              _push2(`<div class="px-10 py-8 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">`);
              ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push2, _parent);
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Modal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "MediaUpload",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    folder: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    useApi();
    const loading = ref(false);
    const error = ref("");
    const isDragging = ref(false);
    const previewUrl = ref(props.modelValue);
    watch(() => props.modelValue, (val) => {
      previewUrl.value = val;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="${ssrRenderClass([{ "border-indigo-600 bg-indigo-50/10": unref(isDragging) }, "relative aspect-video w-full rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-900/50 hover:border-indigo-600 transition-all group overflow-hidden"])}">`);
      if (unref(previewUrl)) {
        _push(`<img${ssrRenderAttr("src", unref(previewUrl))} class="absolute inset-0 w-full h-full object-cover">`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(loading)) {
        _push(`<div class="relative z-10 flex flex-col items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-7-3l-3-3m0 0l-3 3m3-3v12"></path></svg><p class="text-xs font-black text-slate-400 mt-2 uppercase tracking-widest">Click or drag to upload</p><input type="file" class="absolute inset-0 opacity-0 cursor-pointer" accept="image/*"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="relative z-10 flex flex-col items-center"><div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div><p class="text-xs font-black text-indigo-600 mt-4 uppercase tracking-widest">Uploading...</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(error)) {
        _push(`<div class="text-xs font-bold text-red-500">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MediaUpload.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = Object.assign(_sfc_main, { __name: "MediaUpload" });

export { _sfc_main$1 as _, __nuxt_component_1 as a };
//# sourceMappingURL=MediaUpload-DEt6RbaD.mjs.map
