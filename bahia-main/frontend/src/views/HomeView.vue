<template>
  <div class="container-fluid 2">
      <div class="row d-flex justify-content-center">
          <div class="tbl col-md-3 m-2" >
          </div>
          <div class="tbl col-md-7 m-2" >
          </div>
      </div>
  </div>

  

  <a href="/sales" class="bottom-button">View Products Report</a>

</template>

<script>
export default {
  name: "TwoColumnLayout"
};
</script>

<style scoped>
.bottom-button {
  position: fixed;
  bottom: 130px;
  right: 220px;
  background-color: #ff914c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 18px;
  cursor: pointer;
  text-decoration: none; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s;
  width: 160px; 
  text-align: center;
  font-weight: 700;
}

.bottom-button:hover {
  background-color: #e68a2f;
  color: #804811;
}
.tbl{
  border: 2px solid #ff914c; 
  border-radius: 5px; 
  height: 570px;
}

@media (max-width: 768px) { 
  .bottom-button {
      bottom: 20px;
      right: 30px;
      font-size: 16px;
      padding: 8px;
      width: 140px;
  }
  .tbl{
  border: 2px solid #ff914c; 
  border-radius: 5px; 
  height: 300px;
}

}
  @media (max-width: 1280px) { 
  .bottom-button {
      bottom: 20px;
      right: 20px;
      font-size: 16px;
      padding: 8px;
      width: 140px;
  }
  .tbl{
  border: 2px solid #ff914c; 
  border-radius: 5px; 
  height: 370px;
  margin: 5px 20px ;
}
}
</style>
