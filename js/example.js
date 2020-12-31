// Use pure ES5 for max browser compatibility

var skinViewer, control, handles = {}, globalAnimationSpeed = 1;

var skinParts = {}

var canvasWidth  = 800;
var canvasHeight = 500;

function el(id) {
	return document.getElementById(id);
}

function setZoom(value){
	control.enableZoom = value;
}

function initSkinViewer() {
	initSkinViewer(800, 500);
}
function initSkinViewer(width, height) {
	this.canvasWidth  = width;
	this.canvasHeight = height;
	
	if (skinViewer instanceof skinview3d.SkinViewer) {
		skinViewer.dispose();
		handles = {};
		control = undefined;
	}

	var maxWidth = getMaxWidth();

	if (maxWidth == "1024px"){
		canvasWidth = 500;
		canvasHeight = 200;
	}

	// Reset animation speed
	var speedValue = el('speed');
	if (speedValue != null) {
		speedValue.value = globalAnimationSpeed = 1;
	}
	
	var skinURL = el('skin_url');
	var capeURL = el('cape_url');

	skinViewer = new skinview3d.SkinViewer({
		domElement: el("skin_container"),
		width: canvasWidth,
		height: canvasHeight,
		skinUrl: skinURL != null ? skinURL.value : 'images/profile/darelsprings-hd.png',
		capeUrl: capeURL != null ? capeURL.value : 'images/profile/cape.png',
	});

	skinViewer.camera.position.z = 70;
	skinViewer.animation = new skinview3d.CompositeAnimation();

	control = skinview3d.createOrbitControls(skinViewer);
	var parts = skinViewer.playerObject.skin;

	// set inner parts
	skinParts.head = parts.head.innerLayer;
	skinParts.body = parts.body.innerLayer;
	skinParts.leftArm = parts.leftArm.innerLayer;
	skinParts.rightArm = parts.rightArm.innerLayer;
	skinParts.leftLeg = parts.leftLeg.innerLayer;
	skinParts.rightLeg = parts.rightLeg.innerLayer;

	// set outter parts
	skinParts.head2 = parts.head.outerLayer;
	skinParts.body2 = parts.body.outerLayer;
	skinParts.leftArm2 = parts.leftArm.outerLayer;
	skinParts.rightArm2 = parts.rightArm.outerLayer;
	skinParts.leftLeg2 = parts.leftLeg.outerLayer;
	skinParts.rightLeg2 = parts.rightLeg.outerLayer;	
	setZoom(false);
}

function setSkinURL(skinUrl) {
	skinViewer.skinUrl = skinUrl;
}

function setCapeURL(capeUrl){
	var capeObject = skinViewer.playerObject.cape;
	if (capeUrl === "") {
		capeObject.visible = false;
	} else {
		skinViewer.capeUrl = capeUrl;
	}
}

function hotReloadTextures() {
	var capeObject = skinViewer.playerObject.cape;
	var capeUrl = el('cape_url').value;
	var skinUrl = el('skin_url').value;

	// I've noted there is not a good way to set the cape to null
	// so we hide it as work around but need to raise an issue
	if (capeUrl === "") {
		capeObject.visible = false;
	} else {
		skinViewer.capeUrl = capeUrl;
	}

	skinViewer.skinUrl = skinUrl;
}

function resizeSkinViewer() {
	skinViewer.width = el('width').value;
	skinViewer.height = el('height').value;
}

function pause() {
	skinViewer.animationPaused = !skinViewer.animationPaused;
	var button = el('play-pause');
	
	if (button != null){
		button.classList.remove('fa-pause');
		button.classList.remove('fa-play');
		
		button.classList.add(skinViewer.animationPaused ? 'fa-play' : 'fa-pause');
	}
}

function walk() {
	if (handles.run) {
		handles.run.remove();
		delete handles.run;
	}

	handles.walk = handles.walk || skinViewer.animation.add(skinview3d.WalkingAnimation);
	handles.walk.speed = globalAnimationSpeed;
}

function run() {
	if (handles.walk) {
		handles.walk.remove();
		delete handles.walk;
	}

	handles.run = handles.run || skinViewer.animation.add(skinview3d.RunningAnimation);
	handles.run.speed = globalAnimationSpeed;
}

function rotate() {
	if (handles.rotate) {
		handles.rotate.paused = !handles.rotate.paused;
	} else {
		handles.rotate = skinViewer.animation.add(skinview3d.RotatingAnimation);
		handles.rotate.speed = globalAnimationSpeed;
	}
}

function togglePart(partName) {
	skinParts[partName].visible = !skinParts[partName].visible;
}

function setGlobalAnimationSpeed() {
	var currentSpeed = el('speed').value;

	if (!isNaN(currentSpeed)) {
		globalAnimationSpeed = currentSpeed;

		for (var key in handles) {
			handles[key].speed = currentSpeed;
		}
	}
}