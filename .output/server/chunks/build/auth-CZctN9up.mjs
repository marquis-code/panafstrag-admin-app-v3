import { d as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useAuth } from './useAuth-B5P4vKBX.mjs';
import 'vue';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './useApi-WHzNNEGF.mjs';

const auth = defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn.value && !["/login", "/register"].includes(to.path)) {
    return navigateTo("/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-CZctN9up.mjs.map
