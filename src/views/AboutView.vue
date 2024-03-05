<template>
  <div
    id="about"
    class="bg-image"
    :style="{
      'background-image': `url(${require('../assets/jujutsu.jpg')})`,
    }"
  >
    <div style="margin: 10px; padding: 10px">
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!-- Text slides with image -->
        <b-carousel-slide
          caption="First slide"
          text="Nulla vitae elit libero, a pharetra augue mollis interdum."
          img-src="https://picsum.photos/1024/480/?image=52"
        ></b-carousel-slide>

        <!-- Slides with custom text -->
        <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
          <h1>Hello world!</h1>
        </b-carousel-slide>

        <!-- Slides with image only -->
        <b-carousel-slide
          img-src="https://picsum.photos/1024/480/?image=58"
        ></b-carousel-slide>

        <!-- Slides with img slot -->
        <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
        <b-carousel-slide>
          <template #img>
            <img
              class="d-block img-fluid w-100"
              width="1024"
              height="480"
              src="https://picsum.photos/1024/480/?image=55"
              alt="image slot"
            />
          </template>
        </b-carousel-slide>

        <!-- Slide with blank fluid image to maintain slide aspect ratio -->
        <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            eros felis, tincidunt a tincidunt eget, convallis vel est. Ut
            pellentesque ut lacus vel interdum.
          </p>
        </b-carousel-slide>
      </b-carousel>

      <p class="mt-4">
        Slide #: {{ slide }}<br />
        Sliding: {{ sliding }}
      </p>
    </div>
    <header class="text-light text-center py-3" style="flex: 1 0 auto">
      <button class="btn btn-primary" @click="$router.push('/consultar')">
        Consultar por autor
      </button>
      <button class="btn btn-primary" @click="$router.push('/consultar')">
        Ordenar por fecha
      </button>
      <button class="btn btn-primary" @click="$router.push('/consultar')">
        Mostrar si tiene imagen
      </button>

      <!--       <a href="consultar" class="btn btn-primary btn-lg mt-3">Da click</a>
 -->
    </header>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div
        class="col-6 col-md-6 col-lg-4"
        v-for="libro in libros"
        :key="libro.id" draggable @dragstart="startDrag($event)"
      >
        <b-card
          :title="libro.titulo"
          :sub-title="libro.autor"
          :img-src="libro.imagen"
          img-alt="Image"
          img-top
          tag="article"
          style="max-width: 20rem"
          class="mb-2"
        >
          <b-card-text>
            <p class="card-text">
              <small class="text-muted">Publicado en {{ libro.fecha }}</small>
            </p>
          </b-card-text>
          <b-button href="#" variant="primary">Ver detalles</b-button>
        </b-card>
      </div>
      <button class="btn btn-primary" v-b-modal.modal-create>
        Registrar <i class="fas fa-plus"></i>
      </button>
      <div
        style="
          margin: 10px;
          padding: 10px;
          text-align: center;
          background-color: blueviolet;
        "
        @drop="onDrop($event)"
        @dragover.prevent
        @dragenter.prevent
      >
        <p><i class="fas fa-plus"></i> Modificar</p>
      </div>
      <div
        style="
          margin: 10px;
          padding: 10px;
          text-align: center;
          background-color: brown;
        "
      >
        <p><i class="fas fa-plus"></i> Eliminar</p>
      </div>
    </div>

    <footer class="text-light text-center py-3">
      <p>&copy; Todos los derechos reservados.</p>
      <div class="social-icons mt-3">
        <a href="#" class="text-light me-3"><i class="fab fa-twitter"></i></a>
        <a href="#" class="text-light me-3"><i class="fab fa-facebook"></i></a>
        <a href="#" class="text-light me-3"><i class="fab fa-linkedin"></i></a>
        <a href="#" class="text-light"><i class="fab fa-instagram"></i></a>
      </div>
    </footer>

    <!-- MODALES -->
    <!-- Debe tener estos campos: Nombre de libro, autor, fecha de publicación, imagen de portada (opcional). -->
    <b-modal
      id="modal-create"
      ref="modal-create"
      title="Registrar ibro"
      @show="resetModal"
      @hidden="resetModal"
      @ok="createBook"
    >
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group
          label="Name"
          label-for="name-input"
          invalid-feedback="Name is required"
          :state="nameCreateState"
        >
          <b-form-input
            id="name-input"
            v-model="libroCreate.name"
            :state="nameCreateState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Author"
          label-for="author-input"
          invalid-feedback="Author is required"
          :state="authorCreateState"
        >
          <b-form-input
            id="author-input"
            v-model="libroCreate.author"
            :state="libroCreateState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="date"
          label-for="date-input"
          invalid-feedback="Date is required"
          :state="dateCreateState"
        >
          <b-form-input
            id="date-input"
            v-model="libroCreate.date"
            :state="dateCreateState"
            type="date"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Image"
          label-for="image-input"
          :state="imageCreateState"
        >
          <b-form-file
            id="image-input"
            v-model="libroCreate.image"
            :state="imageCreateState"
            accept="image/*"
          ></b-form-file>
          <b-form-invalid-feedback :state="imageCreateState">
            Please select an image
          </b-form-invalid-feedback>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      libroCreate: {
        name: "",
        author: "",
        date: "",
        image: null,
      },
      nameCreateState: null,
      authorCreateState: null,
      dateCreateState: null,
      imageCreateState: null,
      libros: [
        {
          id: 1,
          titulo: "El principito",
          autor: "Antoine de Saint-Exupéry",
          fecha: "1943",
          imagen: "https://picsum.photos/1024/480/?image=52",
        },
        {
          id: 2,
          titulo: "El principito",
          autor: "Antoine de Saint-Exupéry",
          fecha: "1943",
          imagen: "https://picsum.photos/1024/480/?image=54",
        },
        {
          id: 3,
          titulo: "El principito",
          autor: "Antoine de Saint-Exupéry",
          fecha: "1943",
          imagen: "https://picsum.photos/1024/480/?image=58",
        },
        {
          id: 4,
          titulo: "El principito",
          autor: "Antoine de Saint-Exupéry",
          fecha: "1943",
          imagen: "https://picsum.photos/1024/480/?image=55",
        },
      ],
    };
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
    createBook() {
      if (this.$refs["form"].checkValidity()) {
        this.libros.push({
          id: this.libros.length + 1,
          titulo: this.libroCreate.name,
          autor: this.libroCreate.author,
          fecha: this.libroCreate.date,
          imagen: this.libroCreate.image,
        });
        this.$refs["modal-create"].hide();
      } else {
        this.nameCreateState = this.$refs["form"].nameCreateState;
        this.authorCreateState = this.$refs["form"].authorCreateState;
        this.dateCreateState = this.$refs["form"].dateCreateState;
        this.imageCreateState = this.$refs["form"].imageCreateState;
      }
    },
    resetModal() {
      this.libroCreate = {
        name: "",
        author: "",
        date: "",
        image: null,
      };
      this.nameCreateState = null;
      this.authorCreateState = null;
      this.dateCreateState = null;
      this.imageCreateState = null;
    },

    onDrop(event) {
      console.log("Soltado");
      console.log(event);
      this.createMovieFromDrag();
    },

    startDrag(event) {
      console.log("Drag started");
      console.log(event);
    },
  },
};
</script>

<style>
#about {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-self: start;
  justify-content: space-between;
  background-color: #6991ba;
  width: 100%;
  height: 100%;
  font-style: italic;
  color: #000000;
}
</style>