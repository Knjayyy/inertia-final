<template>
  <div>
    <div class="row justify-content-center shadow mt-2 align-items-center" style="background-color: cyan;">
      <div class="col-md-2 mt-3 mb-3 justify-content-center">
        <div class="form-floating">
          <select class="form-select" v-model="postCategory">
            <option value="" disabled>Select a Category</option>
            <option value="all">All</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.category }}</option>
          </select>
          <label for="category" class="form-label text-dark">Category</label>
        </div>
      </div>
    </div>
    <div class="col-md-4 offset-md-4 mt-5" v-for="post in paginatedPosts" :key="post.id">
      <div :class="['post', post.gender && post.gender.toLowerCase() === 'male' ? 'post-male' : 'post-female']">
        <div class="post-header">
          <p class="post-author">{{ post.author }}</p>
          <p class="post-category">{{ getCategoryName(post.category_id) }}</p>
        </div>
        <div class="post-content">
          <div class="content-container">
            <p class="content-text">{{ post.content }}</p>
          </div>
        </div>
        <p class="post-date">{{ formatDate(post.createdAt) }}</p>
      </div>
    </div>
    <div class="row mt-4" v-if="paginatedPosts.length === 0 && posts.length > 0">
      <div class="col">
        <p class="no-posts-text text-center font-semibold">No matching posts.</p>
      </div>
    </div>
    <div class="row mt-4" v-if="paginatedPosts.length === 0 && posts.length === 0">
      <div class="col">
        <p class="no-posts-text text-center font-semibold">No posts yet.</p>
      </div>
    </div>
    <div class="row mt-4" v-if="totalPages > 1">
      <div class="col">
        <nav aria-label="Pagination">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(1)">First</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(currentPage - 1)">Previous</button>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(currentPage + 1)">Next</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(totalPages)">Last</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { db, auth } from '../Firebase/index.js';
import { collection, getDocs, where, query } from 'firebase/firestore';

const posts = ref([]);
const categories = ref([]);
const postSearch = ref('');
const postCategory = ref('');
const currentPage = ref(1);
const postsPerPage = 1;
const userId = ref('');
const currentUser = ref({ fullname: '', gender: '' });

const retrieveCurrentUser = async () => {
  try {
    if (auth.currentUser) {
      const q = query(collection(db, 'authors'), where('uid', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const authorDoc = querySnapshot.docs[0];
        const authorData = authorDoc.data();
        console.log('Full Name:', authorData.fullname);
        console.log('Gender:', authorData.gender);
        currentUser.value = { fullname: authorData.fullname, gender: authorData.gender };
        userId.value = authorDoc.id;
        await fetchPosts(); // Call fetchPosts after setting the userId
      }
    }
  } catch (error) {
    console.error('Error retrieving current user:', error);
  }
};

const fetchCategories = async () => {
  const querySnapshot = await getDocs(collection(db, 'categories'));
  categories.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage));


const fetchPosts = async () => {
  try {
    if (userId.value) {
      const q = query(collection(db, 'posts'), where('author', '==', currentUser.value.fullname));
      const querySnapshot = await getDocs(q);
      const postDataArray = querySnapshot.docs.map((doc) => {
        const postData = doc.data();
        return {
          id: doc.id,
          author: postData.author,
          category_id: postData.category_id,
          content: postData.content,
          createdAt: postData.createdAt ? postData.createdAt.toDate() : new Date(),
          gender: postData.gender,
        };
      });

      posts.value = postDataArray;
      console.log(posts.value)


      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
      }
    } else {
      posts.value = [];
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};

const filteredPosts = computed(() => {
  const searchQuery = postSearch.value.toLowerCase().trim();
  const selectedCategory = postCategory.value;

  if (!searchQuery && !selectedCategory) {
    return posts.value;
  } else {
    return posts.value.filter(post => {
      const postAuthor = post.author.toLowerCase();
      const postContent = post.content.toLowerCase();

      return (
        (!searchQuery ||
          postAuthor.includes(searchQuery) ||
          postContent.includes(searchQuery)) &&
        (!selectedCategory || selectedCategory === 'all' || post.category_id === selectedCategory)
      );
    });
  }
});

const paginatedPosts = computed(() => {
  const startIndex = (currentPage.value - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  return filteredPosts.value.slice(startIndex, endIndex);
});

const goToPage = page => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const getCategoryName = categoryId => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.category : '';
};

onMounted(async () => {
  await Promise.all([fetchPosts(), fetchCategories(), retrieveCurrentUser()]);
});

watch([postSearch, postCategory], () => {
  currentPage.value = 1;
});
</script>


<style scoped>
.post {
  position: relative;
  width: 600px;
  height: 600px;
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
}

.post-male {
  background-color: rgb(58, 182, 240);
}

.post-female {
  background-color: rgb(241, 145, 161);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-author {
  font-size: 20px;
  font-weight: bold;
}

.post-category {
  font-size: 16px;
}

.post-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-container {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  width: 100%;
  height: 100%;
}

.content-text {
  text-align: center;
  margin: 0;
}

.post-date {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 14px;
}

.row.justify-content-center.shadow.mt-2.align-items-center {
  background-color: cyan;
}

.col-md-4 {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
