<template>
  <div class="m-4">
    <div
      class="product container mx-auto"
      style="border: 4px solid #ec993a; max-width: 600px; border-radius: 10px; padding: 40px 80px; margin: 10px; font-weight: 700;"
      ref="productContainer"
    >
      <div class="row mb-3">
        <div class="col">
          <label style="color: black; font-weight: 700; font-size: 18px;">
            <strong>
              Product Code:
              <h2 style="color: #ec993a;">{{ productCode }}</h2>
            </strong>
          </label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col">
          <div class="bordered-container">
            <img
              v-if="qrCode"
              :src="qrCode"
              alt="QR Code"
              class="qrcode"
              style="max-width: 100%; max-height: 100%;"
            />
            <div v-else>Loading QR Code...</div>
          </div>
        </div>
      </div>
      <center><h1 style="color: #ec993a;">{{ productName }}</h1></center>
      <div class="row mb-3">
        <div class="col d-flex justify-content-center">
          <button @click="downloadContainer" class="btnadd">Download</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      qrCode: null,
      productCode: null,
      productName: null,
    };
  },
  mounted() {
    this.productCode = sessionStorage.getItem("productCode");
    this.productName = sessionStorage.getItem("productName");
    if (!this.productCode) {
      console.error("Product code not found in session storage.");
      return;
    }
    this.loadQRCode();
  },
  methods: {
    async loadQRCode() {
      try {
        const qrImage = await import(
          `@/assets/product/qrcode/${this.productCode}.png`
        );
        this.qrCode = qrImage.default;
      } catch (error) {
        console.error("Error loading QR code image:", error);
        this.qrCode = null;
      }
    },
    downloadContainer() {
      const element = this.$refs.productContainer;
      const downloadButton = element.querySelector("button");
      if (downloadButton) {
        downloadButton.style.display = "none";
      }

      html2canvas(element)
        .then((canvas) => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = `${this.productName}_${this.productCode}.png`;
          link.click();
        })
        .catch((error) => {
          console.error("Error generating image from container:", error);
        })
        .finally(() => {
          if (downloadButton) {
            downloadButton.style.display = "block";
          }
        });
    },
  },
};
</script>

<style scoped>
.qrcode {
  width: 100%;
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
  cursor: pointer;
}
.btnadd:hover {
  background-color: #e68339;
}
</style>
