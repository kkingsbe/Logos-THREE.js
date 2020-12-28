var scene, camera, renderer, controls
const width = window.innerWidth
const height = window.innerHeight
const ratio = width / height

const init = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, ratio, 1, 1000)
  camera.position.z = 7
  camera.position.y = 7
  camera.position.x = 3

  controls = new THREE.OrbitControls(camera, document.getElementById("viewport"))
  axis = new THREE.AxisHelper(300)
  scene.add(axis)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setClearColor("#e3e3e3")
  renderer.setSize(width, height)

  document.getElementById("viewport").append(renderer.domElement)

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  })

  const animate = () => {
    //sphere.position.y += 0.1
  }

  const render = () => {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
    controls.update()
    animate()
  }
  render()
}

const getPointLight = (color, intensity, distance) => {
  let light = new THREE.PointLight(color, intensity, distance)
  return light
}

//Returns the dimensions of the given image
async function getImageSize(url) {
  return new Promise((resolve, reject) => {
    let dims = {}
    const img = new Image()
    img.onload = function() {
      dims = {
        width: this.width,
        height: this.height
      }
      resolve(dims)
    }
    img.src = url
  })
}

//Creates a new plane with an image texture
async function addImagePlane(url, height) {
  return new Promise(async (resolve, reject) => {
    //Get the image dimensions
    let dims = await getImageSize(url)
    //Create the plane and maintain the image aspect ratio
    var planeGeometry = new THREE.PlaneGeometry(dims.width * (height/dims.height), height, 1, 1)
    var texture = new THREE.TextureLoader().load(url)
    var planeMaterial = new THREE.MeshLambertMaterial({map: texture})
    planeMaterial.transparent = true //Enables transparency
    var plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.recieveShadow = true
      
    scene.add(plane)
    resolve(plane)
  })
}

async function main() {
  init()
  const light = new THREE.AmbientLight(0x404040)
  scene.add(light)

  var robinhoodPlane = await addImagePlane('./res/Robin Hood Logo.png', 5)
  robinhoodPlane.position.x = -4

  var cgfsPlane = await addImagePlane('./res/CGFS Seal.png', 5)
  cgfsPlane.position.x = 4
}

main()