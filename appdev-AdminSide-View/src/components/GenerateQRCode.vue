<template>
  <div class="m-4">
    <div class="product container mx-auto" style="border: 4px solid #ec993a; max-width: 600px; border-radius: 10px; padding: 40px 80px; margin: 10px; font-weight: 700;" ref="productContainer">
      <div class="row mb-3">
        <div class="col">
          <label style="color: black; font-weight: 700; font-size: 18px;"><strong>Product Code: <h2 style="color: #ec993a;">{{ productCode }}</h2> </strong> </label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <div class="bordered-container">
            <img v-if="qrCode" :src="qrCode" alt="QR Code" style="max-width: 100%; max-height: 100%;" />
          </div>
        </div>
      </div>  

      <div class="row mb-3">
        <div class="col d-flex justify-content-center">
          <button @click="downloadContainer" class="btnadd">Download</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas';

export default {
  data() {
    return {
      qrCode: null,
      productCode: null,
      maxAttempts: 10,
      attemptCount: 0,
      pollingInterval: 1000, // Poll every 1 second
    };
  },
  mounted() {
    // Retrieve the product code from the route parameter
    this.productCode = this.$route.params.productCode;

    // Start polling for the QR code image
    this.pollForQRCode();
  },
  methods: {
    async pollForQRCode() {
      const interval = setInterval(async () => {
        try {
          // Dynamically import and access the QR code image path
          const qrImage = await import(`@/assets/product/qrcode/${this.productCode}.png`);
          this.qrCode = qrImage.default; // Access the image path as a string

          if (this.qrCode) {
            clearInterval(interval); // Stop polling once the QR code is loaded
          }
        } catch (error) {
          this.attemptCount++;
          console.warn(`Attempt ${this.attemptCount}: QR Code image not found. Retrying...`);

          if (this.attemptCount >= this.maxAttempts) {
            clearInterval(interval); // Stop polling after max attempts
            console.error("QR Code image could not be loaded.");
          }
        }
      }, this.pollingInterval);
    },
    downloadContainer() {
      const element = this.$refs.productContainer;
      const downloadButton = element.querySelector('button');
      if (downloadButton) {
        downloadButton.style.display = 'none';
      }

      html2canvas(element)
        .then((canvas) => {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'Product_Container.png';
          link.click();

          if (downloadButton) {
            downloadButton.style.display = 'block';
          }
        })
        .catch((error) => {
          console.error('Error generating image from container:', error);
        });
    }
  }
};
</script>


<style scoped>
.form-control::placeholder {
  color: #ff914c; 
  font-weight: 700;
}
.form-control {
  border: 3px solid #e79224;
  border-radius: 10px;
}
.bordered-container {
  border: 2px solid #e79224;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  color: black;
  font-weight: 700;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btnadd {
  background-color: #ff914c;
  border: none;
  border-radius: 10px;
  padding: 2px 10px;
  color: white;
  font-weight: 900;
  margin: 10px;
  height: 90%;
  width: 30%;
  text-align: center;
}
</style>
