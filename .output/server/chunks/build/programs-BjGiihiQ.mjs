import { _ as _sfc_main$1, a as __nuxt_component_1 } from './MediaUpload-DEt6RbaD.mjs';
import { defineComponent, withAsyncContext, ref, reactive, mergeProps, unref, withCtx, createVNode, withDirectives, vModelText, vModelSelect, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useApi } from './useApi-WHzNNEGF.mjs';
import { u as useAsyncData } from './asyncData-BQK-_ijC.mjs';
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
import 'perfect-debounce';

const useProgram = () => {
  const { fetchWithAuth } = useApi();
  const getPrograms = async () => {
    return fetchWithAuth("/program");
  };
  const getProgram = async (id) => {
    return fetchWithAuth(`/program/${id}`);
  };
  const createProgram = async (data) => {
    return fetchWithAuth("/program", {
      method: "POST",
      body: data
    });
  };
  const updateProgram = async (id, data) => {
    return fetchWithAuth(`/program/${id}`, {
      method: "PATCH",
      body: data
    });
  };
  const deleteProgram = async (id) => {
    return fetchWithAuth(`/program/${id}`, {
      method: "DELETE"
    });
  };
  return {
    getPrograms,
    getProgram,
    createProgram,
    updateProgram,
    deleteProgram
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "programs",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { getPrograms, createProgram, updateProgram } = useProgram();
    const { data: programs, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-programs", () => getPrograms())), __temp = await __temp, __restore(), __temp);
    const showModal = ref(false);
    const editingId = ref(null);
    const form = reactive({
      title: "",
      description: "",
      type: "upcoming",
      date: "",
      imageUrl: "",
      registerLink: ""
    });
    const loading = ref(false);
    const handleSubmit = async () => {
      loading.value = true;
      try {
        if (editingId.value) {
          await updateProgram(editingId.value, form);
        } else {
          await createProgram(form);
        }
        await refresh();
        showModal.value = false;
      } finally {
        loading.value = false;
      }
    };
    useHead({
      title: "Programs Management | PANAFSTRAG"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = _sfc_main$1;
      const _component_MediaUpload = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-12" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-4xl font-black mb-2 tracking-tight">Programs Management</h1><p class="text-slate-500 font-bold">Manage seminar, policy dialogues and events</p></div><button class="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1 active:scale-95 transition-all"> NEW PROGRAM </button></div><div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 dark:bg-slate-800/50"><th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Program</th><th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Type</th><th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Date</th><th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800"><!--[-->`);
      ssrRenderList(unref(programs), (program) => {
        _push(`<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"><td class="px-8 py-6"><div class="flex items-center gap-4"><div class="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden">`);
        if (program.imageUrl) {
          _push(`<img${ssrRenderAttr("src", program.imageUrl)} class="w-full h-full object-cover">`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><p class="font-black text-slate-900 dark:text-white">${ssrInterpolate(program.title)}</p><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${ssrInterpolate(program._id)}</p></div></div></td><td class="px-8 py-6"><span class="${ssrRenderClass([program.type === "upcoming" ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400", "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"])}">${ssrInterpolate(program.type)}</span></td><td class="px-8 py-6"><p class="text-sm font-bold text-slate-600">${ssrInterpolate(new Date(program.date).toLocaleDateString())}</p></td><td class="px-8 py-6 text-right"><div class="flex items-center justify-end gap-2"><button class="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button><button class="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-all shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        show: unref(showModal),
        title: unref(editingId) ? "Edit Program" : "New Program",
        onClose: ($event) => showModal.value = false
      }, {
        actions: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<button class="px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest"${_scopeId}>CANCEL</button><button${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"${_scopeId}>${ssrInterpolate(unref(loading) ? "SAVING..." : "SAVE CHANGES")}</button>`);
          } else {
            return [
              createVNode("button", {
                onClick: ($event) => showModal.value = false,
                class: "px-8 py-4 text-slate-500 font-black text-xs uppercase tracking-widest"
              }, "CANCEL", 8, ["onClick"]),
              createVNode("button", {
                onClick: handleSubmit,
                disabled: unref(loading),
                class: "px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
              }, toDisplayString(unref(loading) ? "SAVING..." : "SAVE CHANGES"), 9, ["disabled"])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-8"${_scopeId}><div class="grid md:grid-cols-2 gap-8"${_scopeId}><div class="space-y-6"${_scopeId}><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Title</label><input${ssrRenderAttr("value", unref(form).title)} type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"${_scopeId}></div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Type</label><select class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black tracking-widest uppercase"${_scopeId}><option value="upcoming"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "upcoming") : ssrLooseEqual(unref(form).type, "upcoming")) ? " selected" : ""}${_scopeId}>Upcoming</option><option value="past"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "past") : ssrLooseEqual(unref(form).type, "past")) ? " selected" : ""}${_scopeId}>Past</option></select></div><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Date</label><input${ssrRenderAttr("value", unref(form).date)} type="date" class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold"${_scopeId}></div></div></div><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Cover Image</label>`);
            _push2(ssrRenderComponent(_component_MediaUpload, {
              modelValue: unref(form).imageUrl,
              "onUpdate:modelValue": ($event) => unref(form).imageUrl = $event,
              folder: "programs"
            }, null, _parent2, _scopeId));
            _push2(`</div></div><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Description</label><textarea rows="4" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"${_scopeId}>${ssrInterpolate(unref(form).description)}</textarea></div><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Registration Link (Optional)</label><input${ssrRenderAttr("value", unref(form).registerLink)} type="url" placeholder="https://..." class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"${_scopeId}></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-8" }, [
                createVNode("div", { class: "grid md:grid-cols-2 gap-8" }, [
                  createVNode("div", { class: "space-y-6" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Title"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).title = $event,
                        type: "text",
                        class: "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).title]
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Type"),
                        withDirectives(createVNode("select", {
                          "onUpdate:modelValue": ($event) => unref(form).type = $event,
                          class: "w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black tracking-widest uppercase"
                        }, [
                          createVNode("option", { value: "upcoming" }, "Upcoming"),
                          createVNode("option", { value: "past" }, "Past")
                        ], 8, ["onUpdate:modelValue"]), [
                          [vModelSelect, unref(form).type]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Date"),
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => unref(form).date = $event,
                          type: "date",
                          class: "w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, unref(form).date]
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Cover Image"),
                    createVNode(_component_MediaUpload, {
                      modelValue: unref(form).imageUrl,
                      "onUpdate:modelValue": ($event) => unref(form).imageUrl = $event,
                      folder: "programs"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Description"),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    rows: "4",
                    class: "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).description]
                  ])
                ]),
                createVNode("div", null, [
                  createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Registration Link (Optional)"),
                  withDirectives(createVNode("input", {
                    "onUpdate:modelValue": ($event) => unref(form).registerLink = $event,
                    type: "url",
                    placeholder: "https://...",
                    class: "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).registerLink]
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/programs.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=programs-BjGiihiQ.mjs.map
