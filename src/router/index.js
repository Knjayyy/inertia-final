import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import CreateView from '../views/CreateView.vue'
import PostsView from '../views/PostsView.vue'
// import CategoriesView from '../views/CategoriesView.vue'
import AuthorsView from '../views/AuthorsView.vue'
import PostedView from '../views/PostedView.vue'
import AuthPostsView from '../views/AuthPostsView.vue'
import authorPostsView from '../views/authorPostsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostsView
    },
    // {
    //   path: '/category',
    //   name: 'category',
    //   component: CategoriesView
    // },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      name: 'authors',
      component: AuthorsView
    },
    {
      path: '/authPost',
      name: 'authPost',
      component: AuthPostsView
    },
    {
      path: '/authorPosts/:authorId',
      cname: 'authorPosts',
      component: authorPostsView
    },
    {
      path: '/posted',
      name: 'posted',
      component: PostedView
    }
  ]
})

export default router
