<template>
<div class="row justify-content-center mt-5">
  <div class="col-md-5">
    <div class="row g-2 justify-content-center">
      <div class="col-lg-3">
        <div class="card h-100 text-center">
          <div class="card-body d-flex flex-column justify-content-center shadow">
            <h4 class="card-title"><span class="green-text">{{ midterms.length }}</span></h4>
            <p class="card-text mb-0"><span class="green-text">All Users</span></p>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card h-100 text-center">
          <div class="card-body d-flex flex-column justify-content-center shadow">
            <h4 class="card-title"><span class="pink-text">{{ femaleUsers }}</span></h4>
            <p class="card-text mb-0"><span class="pink-text">Female Users</span></p>
          </div>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card h-100 text-center">
          <div class="card-body d-flex flex-column justify-content-center shadow">
            <h4 class="card-title"><span class="blue-text">{{ maleUsers }}</span></h4>
            <p class="card-text mb-0"><span class="blue-text">Male Users</span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  <div class="table-responsive mt-5 container" style="max-width: 800px;">
    <h3 class="card-title mb-0 text-start" style="font-size: 18px; font-weight: 600;">List of All Users</h3>  
  <div class="card">
    <div class="card-body py-3 shadow">
      <table class="table mb-0 table-sm">
        <thead class="thead-dark">
          <tr>
            <th class="align-middle">Full Name</th>
            <th class="align-middle">Address</th>
            <th class="align-middle">Contact Number</th>
            <th class="align-middle">Email Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(midterm, index) in midterms" :key="index">
            <td class="align-middle font-weight-bolder" :style="{ color: midterm.gender === 'Female' ? 'pink' : 'blue' }">{{ midterm.fullname }}</td>
            <td class="align-middle font-weight-bold" :style="{ color: midterm.gender === 'Female' ? 'pink' : 'blue' }">{{ midterm.address }}</td>
            <td class="align-middle font-weight-bold" :style="{ color: midterm.gender === 'Female' ? 'pink' : 'blue' }">{{ midterm.contactnum }}</td>
            <td class="align-middle font-weight-bold" :style="{ color: midterm.gender === 'Female' ? 'pink' : 'blue' }">{{ midterm.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

</template>

  
    
    <script setup>
    import { ref, onMounted } from 'vue'
    import {db} from '../Firebase/index.js'
    import {addDoc, collection, onSnapshot} from "firebase/firestore";

    
    const midterms = ref([])
    const id = ref(1)
    const q = (collection(db, "firebasemid"));
    
    const femaleUsers = ref(0)
    const maleUsers = ref(0)
    onMounted(async()=>{
      onSnapshot(q,(snapshot)=> {
        const midtermTmp = []
        let femaleCount = 0
        let maleCount = 0
        snapshot.forEach((doc) => {
    
        const midterm = {
          id: doc.id,
          fullname: doc.data().fullname,
          address: doc.data().address,
          gender: doc.data().gender,
          email: doc.data().email,
          contactnum: doc.data().contactnum,
          completed: doc.data().completed
        }
    
        midtermTmp.push(midterm)
        if(midterm.gender == 'Female'){
            femaleCount++
        }
        if(midterm.gender == 'Male'){
            maleCount++
        }
      });
      midterms.value = midtermTmp
      femaleUsers.value = femaleCount
      maleUsers.value = maleCount
      })
    })
    </script>

<style>
table tbody tr td 
{
  border-bottom: none;
}
.table thead 
{
  border-bottom: 3px solid black;
}
th 
{
  padding: 10px;
}
.green-text {
  color: green;
}

.pink-text {
  color: pink;
}

.blue-text {
  color: blue;
}


</style>