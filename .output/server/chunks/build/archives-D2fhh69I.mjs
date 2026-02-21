import { _ as _sfc_main$1, a as __nuxt_component_1 } from './MediaUpload-DEt6RbaD.mjs';
import { defineComponent, withAsyncContext, ref, reactive, mergeProps, unref, withCtx, createVNode, withDirectives, vModelText, vModelSelect, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

const useArchive = () => {
  const { fetchWithAuth } = useApi();
  const getArchives = async () => {
    return fetchWithAuth("/archive");
  };
  const getArchive = async (id) => {
    return fetchWithAuth(`/archive/${id}`);
  };
  const createArchive = async (data) => {
    return fetchWithAuth("/archive", {
      method: "POST",
      body: data
    });
  };
  const updateArchive = async (id, data) => {
    return fetchWithAuth(`/archive/${id}`, {
      method: "PATCH",
      body: data
    });
  };
  const deleteArchive = async (id) => {
    return fetchWithAuth(`/archive/${id}`, {
      method: "DELETE"
    });
  };
  return {
    getArchives,
    getArchive,
    createArchive,
    updateArchive,
    deleteArchive
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "archives",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { getArchives, createArchive, updateArchive } = useArchive();
    const { data: archives, refresh } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("admin-archives", () => getArchives())), __temp = await __temp, __restore(), __temp);
    const showModal = ref(false);
    const editingId = ref(null);
    const form = reactive({
      title: "",
      description: "",
      type: "speech",
      date: "",
      year: (/* @__PURE__ */ new Date()).getFullYear(),
      month: "",
      fileUrl: "",
      thumbnailUrl: ""
    });
    const loading = ref(false);
    const handleSubmit = async () => {
      loading.value = true;
      try {
        if (editingId.value) {
          await updateArchive(editingId.value, form);
        } else {
          await createArchive(form);
        }
        await refresh();
        showModal.value = false;
      } finally {
        loading.value = false;
      }
    };
    useHead({
      title: "Archives Management | PANAFSTRAG"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Modal = _sfc_main$1;
      const _component_MediaUpload = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-12" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-4xl font-black mb-2 tracking-tight">Archives Management</h1><p class="text-slate-500 font-bold">Manage speeches, reports, and research resources</p></div><button class="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none hover:-translate-y-1 active:scale-95 transition-all"> ADD RESOURCE </button></div><div class="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"><table class="w-full text-left border-collapse"><thead><tr class="bg-slate-50 dark:bg-slate-800/50"><th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Resource</th><th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Type</th><th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Year</th><th class="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th></tr></thead><tbody class="divide-y divide-slate-100 dark:divide-slate-800"><!--[-->`);
      ssrRenderList(unref(archives), (item) => {
        _push(`<tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"><td class="px-8 py-6"><div><p class="font-black text-slate-900 dark:text-white">${ssrInterpolate(item.title)}</p><p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">${ssrInterpolate(item.description)}</p></div></td><td class="px-8 py-6"><span class="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">${ssrInterpolate(item.type)}</span></td><td class="px-8 py-6 font-bold text-sm">${ssrInterpolate(item.year)}</td><td class="px-8 py-6 text-right"><div class="flex items-center justify-end gap-2"><button class="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg></button><button class="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-all shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      _push(ssrRenderComponent(_component_Modal, {
        show: unref(showModal),
        title: unref(editingId) ? "Edit Resource" : "New Resource",
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
            _push2(`<div class="space-y-8"${_scopeId}><div class="space-y-6"${_scopeId}><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Title</label><input${ssrRenderAttr("value", unref(form).title)} type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"${_scopeId}></div><div class="grid grid-cols-3 gap-4"${_scopeId}><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Type</label><select class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black tracking-widest uppercase"${_scopeId}><option value="speech"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "speech") : ssrLooseEqual(unref(form).type, "speech")) ? " selected" : ""}${_scopeId}>Speech</option><option value="report"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "report") : ssrLooseEqual(unref(form).type, "report")) ? " selected" : ""}${_scopeId}>Annual Report</option><option value="media"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "media") : ssrLooseEqual(unref(form).type, "media")) ? " selected" : ""}${_scopeId}>Media</option><option value="research"${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "research") : ssrLooseEqual(unref(form).type, "research")) ? " selected" : ""}${_scopeId}>Research Paper</option></select></div><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Year</label><input${ssrRenderAttr("value", unref(form).year)} type="number" class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold"${_scopeId}></div><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Date</label><input${ssrRenderAttr("value", unref(form).date)} type="date" class="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold"${_scopeId}></div></div></div><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Description</label><textarea rows="3" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm"${_scopeId}>${ssrInterpolate(unref(form).description)}</textarea></div><div class="grid grid-cols-2 gap-8"${_scopeId}><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Resource File (URL)</label><input${ssrRenderAttr("value", unref(form).fileUrl)} type="url" placeholder="https://..." class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm"${_scopeId}></div><div${_scopeId}><label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1"${_scopeId}>Thumbnail Image</label>`);
            _push2(ssrRenderComponent(_component_MediaUpload, {
              modelValue: unref(form).thumbnailUrl,
              "onUpdate:modelValue": ($event) => unref(form).thumbnailUrl = $event,
              folder: "archives"
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-8" }, [
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
                  createVNode("div", { class: "grid grid-cols-3 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Type"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => unref(form).type = $event,
                        class: "w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-black tracking-widest uppercase"
                      }, [
                        createVNode("option", { value: "speech" }, "Speech"),
                        createVNode("option", { value: "report" }, "Annual Report"),
                        createVNode("option", { value: "media" }, "Media"),
                        createVNode("option", { value: "research" }, "Research Paper")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, unref(form).type]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Year"),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => unref(form).year = $event,
                        type: "number",
                        class: "w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-xs font-bold"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [
                          vModelText,
                          unref(form).year,
                          void 0,
                          { number: true }
                        ]
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
                  createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Description"),
                  withDirectives(createVNode("textarea", {
                    "onUpdate:modelValue": ($event) => unref(form).description = $event,
                    rows: "3",
                    class: "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).description]
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-8" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Resource File (URL)"),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).fileUrl = $event,
                      type: "url",
                      placeholder: "https://...",
                      class: "w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium text-sm"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, unref(form).fileUrl]
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1" }, "Thumbnail Image"),
                    createVNode(_component_MediaUpload, {
                      modelValue: unref(form).thumbnailUrl,
                      "onUpdate:modelValue": ($event) => unref(form).thumbnailUrl = $event,
                      folder: "archives"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/archives.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=archives-D2fhh69I.mjs.map
