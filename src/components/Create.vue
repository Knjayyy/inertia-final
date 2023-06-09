<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-4">
      <div class="card">
        <div class="card-header bg-cyan text-black">
          <h3 class="card-title text-center">Create Post</h3>
        </div>
        <div class="card-body card-body-daylight">
          <div class="form-floating mb-3">
            <select name="category_id" class="form-select" v-model.defer="category_id">
              <option value="" hidden>Select Category</option>
              <option value="" selected disabled>Select Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.category }}</option>
            </select>
            <label for="category_id">Category</label>
            <p class="text-danger">{{ errors.category_id }}</p>
          </div>
          <div class="form-floating mb-3">
            <textarea class="form-control" type="text" name="post" style="width:100%; height:300px;" id="exampleFormControlTextarea1" rows="5" v-model.defer="content"></textarea>
            <label for="content">Content</label>
            <p class="text-danger">{{ errors.content }}</p>
          </div>
          <div v-if="success" class="alert alert-success">
            {{ success }}
          </div>
            <div class="form-group d-grid gap-2 d-md-flex justify-content-end">
              <button id="" class="btn btn-custom" type="submit" @click="store()">POST</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { db, auth } from '../Firebase/index.js';
import { collection, query, addDoc, getDocs, serverTimestamp, where } from 'firebase/firestore';

const categories = ref([]);
const category_id = ref('');
const content = ref('');
const success = ref('');
const errors = ref({});
const currentUser = ref({ fullname: '', gender: '' });

const store = async () => {
  errors.value = {};

  if (!category_id.value) {
    errors.value.category_id = 'Please select a category';
  }

  if (!content.value.trim()) {
    errors.value.content = 'Please enter the post content';
  }

  if (Object.keys(errors.value).length > 0) {
    return; 
  }

  try {
    await addDoc(collection(db, 'posts'), {
      category_id: category_id.value,
      content: content.value,
      author: currentUser.value.fullname,
      gender: currentUser.value.gender,
      createdAt: serverTimestamp() 
    });

    category_id.value = '';
    content.value = '';

    success.value = 'Post created successfully!';
  } catch (error) {
    console.error('Error creating post:', error);
    success.value = '';
    errors.value.storeError = 'Failed to create post. Please try again.';
  }
};

const fetchCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    categories.value = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const retrieveCurrentUser = async () => {
  try {
    const q = query(collection(db, 'authors'), where('uid', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const authorDoc = querySnapshot.docs[0];
      const authorData = authorDoc.data();
      console.log('Full Name:', authorData.fullname);
      console.log('Gender:', authorData.gender);
      currentUser.value = { fullname: authorData.fullname, gender: authorData.gender };
    }
  } catch (error) {
    console.error('Error retrieving current user:', error);
  }
};

onMounted(async () => {
  await Promise.all([fetchCategories(), retrieveCurrentUser()]);
});

watchEffect(() => {
  retrieveCurrentUser();
});
</script>


<style>
.bg-cyan {
  background-color: cyan;
}

</style>
