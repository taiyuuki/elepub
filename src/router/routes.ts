import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PreviewContent.vue') },
    ],
  },
  {
    path: '/booklist',
    name: 'booklist',
    component: () => import('layouts/BookList.vue'),
  },
  {
    path: '/bookreader',
    name: 'bookreader',
    component: () => import('layouts/BookReader.vue'),
  },
];

export default routes;
