<template>
  <div class="q-pa-md">
    <q-table 
      title="Products" 
      :data="$store.state.productStore.products" 
      :columns="columns" 
      row-key="name"
      hide-pagination
      :pagination.sync="pagination"
    >
      <template v-slot:top>
        <q-btn flat outline dense color="primary" label="Add Product"
          @click="show_dialog = true; isUpdate = false; clearObject()"></q-btn>
        <div class="q-pa-sm q-gutter-sm">
          <q-dialog v-model="show_dialog">
            <q-card>
              <q-card-section>
                <div class="text-h6">Product Form!</div>
              </q-card-section>

              <q-form @submit.prevent="addProduct" @reset.prevent.stop="onReset">

                <q-card-section>
                  <div class="row">
                    <div class="col-12">
                      <q-select ref="productTypeRef" :options="$store.state.productStore.productTypes"
                        v-model="productForm.product_type_id" label="Product Type" option-label="name_uz"
                        option-value="id" emit-value map-options :rules="[
                          (val) => (val) || 'Product type must be filled in.',
                        ]"></q-select>
                    </div>
                    <div class="col-12">
                      <q-input ref="nameUzRef" v-model="productForm.name_uz" label="Name" :rules="[
                        (val) => (val && val.length > 0) || 'Name must be filled in.',
                      ]"></q-input>
                    </div>
                    <div class="col-12">
                      <q-input ref="costRef" v-model="productForm.cost" type="number" label="Cost" :rules="[
                        (val) => (val && val > 0) || 'Cost type must be filled in.',
                      ]"></q-input>
                    </div>
                    <div class="col-12">
                      <q-input ref="addressRef" v-model="productForm.address" label="Address" :rules="[
                        (val) => (val && val.length > 0) || 'Address must be filled in.',
                      ]"></q-input>
                    </div>
                  </div>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat :label="isUpdate ? 'Update' : 'Save'" color="primary" @click="addProduct"></q-btn>
                  <q-btn flat label="Cancel" color="deep-orange" v-close-popup @click="show_dialog = false"></q-btn>
                </q-card-actions>
              </q-form>
            </q-card>
          </q-dialog>
        </div>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="id" :props="props">
            {{ props.row.id }}
          </q-td>
          <q-td key="product_type_id" :props="props">
            {{ props.row.product_type_id }}
          </q-td>
          <q-td key="name_uz" :props="props">
            {{ props.row.name_uz }}
          </q-td>
          <q-td key="cost" :props="props">
            {{ props.row.cost }}
          </q-td>
          <q-td key="address" :props="props">
            {{ props.row.address }}
          </q-td>
          <q-td key="created_date" :props="props">
            {{ props.row.created_date | dateFormatFilter }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn color="blue" icon="edit" @click="editItem(props.row)" size="sm"></q-btn>
            <q-btn color="red" icon="delete" @click="deleteItem(props.row.id)" size="sm"></q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <div class="row justify-center q-mt-md">
      <q-pagination v-model="pagination.page" direction-links boundary-links :max="pageNumber"/>
    </div>

  </div>
</template>

<script>
import { Dialog, Notify } from 'quasar'
import moment from 'moment'
export default {
  mounted() {
    this.$store.dispatch('productStore/getProductsAction')
    this.$store.dispatch('productStore/getProductTypesAction')
  },
  filters: {
    dateFormatFilter(value) {
      return moment(value).format('MMMM Do YYYY, h:mm:ss a')
    }
  },
  data: () => ({
    pagination: {
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    },
    show_dialog: false,
    isUpdate: false,
    columns: [
      {
        name: "id",
        label: "#ID",
        field: 'id',
        sortable: true
      },
      {
        name: "product_type_id",
        label: "Product Type",
        field: 'product_type_id',
        sortable: true
      },
      {
        name: "name_uz",
        label: "Name Uz",
        field: 'name_uz',
        sortable: true
      },
      {
        name: "cost",
        label: "Cost",
        field: 'cost',
        sortable: true
      },
      {
        name: "address",
        label: "Address",
        field: 'address',
        sortable: true
      },
      {
        align: 'center',
        name: "created_date",
        label: "Created At",
        field: 'created_date',
        sortable: true
      },
      {
        name: "actions",
        label: 'Actions'
      }
    ],

    // entity
    productForm: {
      product_type_id: '',
      name_uz: '',
      cost: '',
      address: ''
    }
  }),
  computed: {
    pageNumber () {
      return Math.ceil(this.$store.state.productStore.products.length / this.pagination.rowsPerPage)
    }
  },
  methods: {
    getProductType(id) {
      return this.$store.state.productStore.productTypes.find(type => type.id == id);
    },

    clearObject() {
      let obj = {
        product_type_id: '',
        name_uz: '',
        cost: '',
        address: '',
      }

      this.productForm = obj;
    },

    validations() {
      this.$refs.productTypeRef.validate();
      this.$refs.nameUzRef.validate();
      this.$refs.addressRef.validate();
      this.$refs.costRef.validate();

      return this.$refs.productTypeRef.hasError
        || this.$refs.nameUzRef.hasError
        || this.$refs.addressRef.hasError
        || this.$refs.costRef.hasError
    },
    addProduct() {
      if (this.validations()) {
        return;
      }
      if (this.isUpdate) {
        this.$store.dispatch('productStore/updateProductAction', this.productForm)
          .then(() => {
            Notify.create({
              message: "Product is updated successfully!",
              position: 'top-right',
              color: 'green',
              timeout: 3000
            })
          }).catch(error => {
            Notify.create({
              message: "Something went wrong!",
              position: 'top-right',
              color: 'red',
              timeout: 3000
            })
          })
      } else {
        this.$store.dispatch('productStore/postProductAction', { ...this.productForm, created_date: Date.now()})
          .then(() => {
            Notify.create({
              message: "Product is added successfully!",
              position: 'top-right',
              color: 'green',
              timeout: 3000
            })
          }).catch(error => {
            Notify.create({
              message: "Something went wrong!",
              position: 'top-right',
              color: 'red',
              timeout: 3000
            })
          });
      }
      this.clearObject();
      this.show_dialog = false;
    },

    deleteItem(productId) {

      Dialog.create({
        message: "Do you want to delete this product",
        cancel: true
      }).onOk(() => {
        this.$store.dispatch('productStore/deleteProductAction', productId)
          .then(() => {
            Notify.create({
              message: "Product is deleted successfully!",
              position: 'top-right',
              color: 'green',
              timeout: 3000
            })
          }).catch(error => {
            Notify.create({
              message: "Something went wrong!",
              position: 'top-right',
              color: 'red',
              timeout: 3000
            })
          })
      })

    },

    editItem(item) {
      this.show_dialog = true;
      this.isUpdate = true;
      this.productForm = { ...item };
    },

    onReset() {
      this.$refs.productTypeRef.value.resetValidation()
      this.$refs.nameUzRef.value.resetValidation()
      this.$refs.costRef.value.resetValidation()
      this.$refs.addressRef.value.resetValidation()
    }
  }
}
</script>
