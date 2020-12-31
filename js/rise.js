var currentBoxModel = null;
var currentItemCost = null;

var selectedPayment = null;
var selectedCredit  = null;
var selectedGiftName = null;
var selectedClanColor = null;
var selectedWingType = null;
var selectedHatType = null;

var ERROR_SYSTEM_MESSAGE = "Sistemde bir hata oluştu, sayfayı yenileyiniz.";

function setSelectedHatType(type) {
	this.selectedHatType = type;
}

function getSelectedHatType() {
	return this.selectedHatType;
}


function setSelectedWingType(type) {
	this.selectedWingType = type;
}

function getSelectedWingType() {
	return this.selectedWingType;
}

function setSelectedClanColor(element) {
	this.selectedClanColor = element;
}

function getSelectedClanColor() {
	return this.selectedClanColor;
}

function setGiftName(name){
	this.selectedGiftName = name;
}

function getGiftName(){
	return this.selectedGiftName;
}

function setCredit(credit){
	this.selectedCredit = credit;
}
function getCredit(){
	return this.selectedCredit;
}

function setPayment(payment){
	this.selectedPayment = payment;
}
function getPayment(){
	return this.selectedPayment;
}

function getCurrentItemCost(){
	return this.currentItemCost;
}

function setCurrentItemCost(cost) {
	this.currentItemCost = cost;
}

function getCurrentBoxModel(){
	return this.currentBoxModel;
}

function removeCurrentBoxModel(){
	if (this.currentBoxModel != null){
		var isOkey = onCloseModel(this.currentBoxModel);
		if (isOkey) {
			$(this.currentBoxModel).remove();
		}
	}
}

function setCurrentBoxModel(model){ 
	currentBoxModel = model;
}

function loadSkin() {
	const url = 'process.php';
	const form = document.querySelector('form');

    const files = document.querySelector('[type=file]').files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        formData.append('files[]', file);
    }

    fetch(url, {
        method: 'POST',
        body: formData
    }).then(response => {
        console.log(response);
    });
}

$(document).ready(function() {
	registerEvents();
	setupTags();
	setupResponsive();
	setupShop();

	$(window).resize(function() {
		onResize();
	});
	  
	$('[data-toggle="tooltip"]').tooltip(); 

	var currentHeight  = document.body.scrollHeight;
	var maxHeight      = screen.height;

	if (currentHeight + 500 < maxHeight){
		var footer = $("#footer");

		footer.css("position", "absolute");
	}

	//console.log("PageHeight: " + currentHeight + " maxHeight: " + maxHeight);
});


function setupShop(){
	var leftPage = $(".left-page");

	leftPage.find('.shopItem').each(function() {
		
		var image = $(this).find(".image img")[0];
		var max = $(image).css("max-height");

		$(image).hover(
			function() {
				var mhx = image.style.maxHeight;
				$(image).css("max-height", "+=20%");
			},
			function() {
				$(image).css("max-height", max);
			},
		);
    });
}

function setupResponsive(){
	var currentWidth   = $(window).width();
	var maxWidth       = screen.width;

	var maxContainerWidth = 1200;

	//console.log("PageWidth: " + currentWidth + " maxWidth: " + maxWidth);

	var containerSide = $(".container-side");

	var newWidth = (currentWidth / 2) + 300;

	if (maxWidth > currentWidth && maxContainerWidth < newWidth){
		//containerSide.css("width", newWidth);
	}
}

function onResize(){
	setupResponsive();
}

function setupUploadButton(element) {
	var inputElement  = element.getElementsByTagName('input')[0];
	var buttonElement = element.getElementsByTagName('button')[0];

	inputElement.onchange = function() {
		buttonElement.innerHTML = inputElement.value;
	};
}

function setupTags(){
	var tagContainers = document.getElementsByClassName("tags-container");

	Array.prototype.forEach.call(tagContainers, function(element) {
		var inputElement = element.getElementsByTagName('input')[0];
		var input        = $(inputElement);
		var limit        = $(element).attr("taglimit");

		input.focus();
		input.css("border", "none");
		input.keydown(function(e){

			if(e.keyCode == 188 || e.keyCode == 32) {
				if(e.preventDefault) {
					e.preventDefault();

					if ($(element).find(".tagElement").length >= limit){
						makeAlert("Maksimum değer sayısına ulaştınız.", 500, "error");
						return;
					}
	
					var value = input.val();
	
					if(value == '' || value == ' ') return false;
					
					if (hasTag($(element), value)) {
						makeAlert("Bu değer zaten mevcut.", 500, "error");
	
						input.value = '';
						return false;
					}
					
					addTag($(element).find(".tagHere"), input);
				}
				return false;
			}
			
			if(input.val() == '' && e.keyCode === 8) {
				$(".tagElement:last-child").remove();
			}
		});

	});

}

function hasTag(element, value){
	var hasTag = false;

	element.find('.tagElement').each(function() {
		//console.log("element tag: " + this.id);

		var spanTag = $(this).find("span")[0];

		if (spanTag.innerHTML == value){
			hasTag = true;
		}
    });

	return hasTag;
}

function addTag(element, input) {
	var $tag = $("<div />"), $a = $("<a/>"), $span = $("<span />");

	$tag.addClass('tagElement');

	$('<i class="fa fa-times" aria-hidden="true"></i>').appendTo($a);
	$span.text(input.val());
	$a.bind('click', function(){
		$(this).parent().remove();
		$(this).unbind('click');
	});
	$a.appendTo($tag);
	$span.appendTo($tag);
	$tag.appendTo(element);

	input.val('');
}

function getTags(elementID){
	var values = new Array();

	var element = $(elementID);

	$(element).find('.tagElement').each(function(){
		var innerSpan = $(this).children('span');
		values.push(innerSpan.html());
	});

	return values;
}

function registerEvents() {
	var accountMenu   = document.getElementById("accountMenu");
	var accountButton = document.getElementById("accountLinkButton");

	if (accountButton != null){
		accountButton.addEventListener("mouseover", function() {
			setDisplayBlock(accountMenu);
		});
		accountButton.addEventListener("mouseout", function() {
			hideElement(accountMenu);
		});
		accountMenu.addEventListener("mouseover", function() {
			setDisplayBlock(accountMenu);
		});
		accountMenu.addEventListener("mouseout", function() {
			hideElement(accountMenu);
		});
	}

	var categories = document.getElementById("ticket-category");

	if (categories != null){
		categories.addEventListener("change", function() {
			setupForms(categories.value);
		});
	}

	window.onclick = function(event) {
		var targetElement = event.target;
		var elementID = targetElement.id;

		if (elementID == "clan-color") {
			this.onClickClanColor(targetElement);
		}

		if ($(targetElement).find(".box").length > 0){ 
			this.closeModels();
		}
	}
}

function setupPayments(value){
	var mobile = document.getElementById("mobilePayment");
	var card   = document.getElementById("cardPayment");
	
	if (value >= 50){
		hideElement(mobile);
	} else {
		setDisplayInlineBlock(mobile);
	}
}

function onClickChangeClanName() {
	var name = document.getElementById("clanName");

	if (name == null || name.value == ""){
		makeAlertError("Lonca adı boş bırakılamaz.", 400);
		return;
	}
	
	setProcessButton("#change-clan-name-button");

	$.ajax({
		type: "POST",
		url:  "posts/post-clanname.php",
		data : {
			clanName : name.value,
		}, 
		
		success: function(result){
			unsetProcessButton('#change-clan-name-button');

			var data = JSON.parse(result);
			var resultType       = data.resultType;
			var resultMessage    = data.resultMessage;

			makeAlert(resultMessage, 500, resultType);
		}
	});
}

function onClickChangeClanColor() {
	var clanColorElement = this.getSelectedClanColor();
	if (clanColorElement == null) {
		makeAlertError("Lütfen bir renk seçin.", 400);
		return;
	}
	var colorID = $(clanColorElement).attr("colorid");

	setProcessButton("#change-clan-color-button");

	$.ajax({
		type: "POST",
		url:  "posts/post-clancolor.php",
		data : {
			clanColor : colorID,
		},
		
		success: function(result){
			unsetProcessButton('#change-clan-color-button');
			var data = JSON.parse(result);
			var resultType       = data.resultType;
			var resultMessage    = data.resultMessage;

			makeAlert(resultMessage, 600, resultType);
		}
	});
}

function onCreateClan() {
	var clanName = document.getElementById("clanName");

	if (clanName == null || clanName.value == ""){
		makeAlertError("Lonca adı boş bırakılamaz.", 400);
		return;
	}

	setProcessButton("#create-button");

	$.ajax({
		type: "POST",
		url:  "posts/post-createclan.php",
		data : {
			clanName : clanName.value
		},
		
		success: function(result){
			unsetProcessButton('#create-button');

			var data = JSON.parse(result);
			var resultType       = data.resultType;
			var resultID         = data.resultID;
			var resultMessage    = data.resultMessage;

			makeAlert(resultMessage, 600, resultType);

			if (resultID != null && resultID == 6) {
				window.location.reload();
			}
		}
	});


}

function onClickGiftButton(){
	var giftForm = document.getElementById("credit-giftform");
	var giftCheckbox = document.getElementById("giftCheckbox");

	if (giftCheckbox.checked == true) {
		showElement(giftForm);
	} else {
		hideElement(giftForm);
	}
}

var messageReasons = ['Hile', 'Küfür', 'Takım Bildirimi', 'Hata Bildirimi', 'Dolandırıcılık Bildirimi', 'Öneriler', 'Reklam Bildirimi', 'Oyun Bozanlık Bildirimi', 'Sorular', 'Disguise Yetki İsteği', 'RiseClient', 'Ödeme Bildirimi'];
var linkReasons    = ['Hile', 'Küfür', 'Takım Bildirimi', 'Hata Bildirimi', 'Dolandırıcılık Bildirimi', 'Reklam Bildirimi', 'Oyun Bozanlık Bildirimi', 'Ödeme Bildirimi'];
var playersReasons = ['Hile', 'Küfür', 'Takım Bildirimi', 'Dolandırıcılık Bildirimi', 'Reklam Bildirimi', 'Oyun Bozanlık Bildirimi'];
var playerReasons  = ['Ceza İtirazı'];

function addShowEffect(element){
	$(element).addClass("fadeIn");
	$(element).addClass("fast");

	animateCSS(element, 'bounce');
}

function setupForms(value) {
	var linkArea    = document.getElementById("link-area");
	var fileArea    = document.getElementById("files-area");
	var playerArea  = document.getElementById("player-area");
	var playersArea = document.getElementById("players-area");
	var messageArea = document.getElementById("message-area");
	var regionArea  = document.getElementById("region-area");
	var paymentArea = document.getElementById("payment-area");
	var channelArea = document.getElementById("channel-area");

	if (messageReasons.includes(value)){
		showElement(messageArea);
		addShowEffect(messageArea);
	} else {
		hideElement(messageArea);
	}

	if (linkReasons.includes(value)){
		showElement(fileArea);
		showElement(linkArea);
		addShowEffect(linkArea);
		addShowEffect(fileArea);
	} else {
		hideElement(fileArea);
		hideElement(linkArea);
	}

	if (playersReasons.includes(value)){
		showElement(playersArea);
		addShowEffect(playersArea);
	} else {
		hideElement(playersArea);
	}

	if (playerReasons.includes(value)){
		showElement(playerArea);
		addShowEffect(playerArea);
	} else {
		hideElement(playerArea);
	}

	if (value == "Hata Bildirimi"){
		showElement(regionArea);
		addShowEffect(regionArea);
	} else {
		hideElement(regionArea);
	}

	if (value == "Ödeme Bildirimi") {
		showElement(paymentArea);
		addShowEffect(paymentArea);
	} else {
		hideElement(paymentArea);
	}
	if (value == "Disguise Yetki İsteği"){
		showElement(channelArea);
		addShowEffect(channelArea);
	} else {
		hideElement(channelArea);
	}
}

function addClass(element, c){
	element.classList.add(c);
}

function showElement(element){
	element.style.display = "block";
	
	//checkModel(element);
}

function checkModel(element){
	var boxModel = $(element).children(".box");
	if (boxModel == null) return;

	addAnimate(boxModel[0], "zoomIn", "slow");
}

function setDisplayTable(element){
	element.style.display = "table";
}

function setDisplayTableCell(element){
	element.style.display = "table-cell";
}
function setDisplayInlineBlock(element){
	element.style.display = "inline-block";
}
function setDisplayBlock(element){
	element.style.display = "block";
}

function hideElement(element){
	if (element == null) return;
	
	element.style.display = "none";
}

function removeElement(element){
	if (element == null) return;
	
	element.remove();
}

function removeElementById(elementID){
	if (elementID == null) return;

	var element = document.getElementById(elementID);
	if (element == null) return;

	element.remove();
}

function removeElementsById(elementNameList){
	if (elementNameList == null) return;

	Array.prototype.forEach.call(elementNameList, function(elementId) {
		var element = document.getElementById(elementId);
		if (element == null) return;

		removeElement(element);
	});
}

function hideElements(elementNameList){
	if (elementNameList == null) return;

	Array.prototype.forEach.call(elementNameList, function(elementId) {
		var element = document.getElementById(elementId);
		if (element == null) return;

		hideElement(element);
	});
}

function hideElementById(elementId){
	var element = document.getElementById(elementId);
	if (element == null) return;
	
	hideElement(element);
}

function hideElementsByClass(elementClass){
	var elementList = document.getElementsByClassName(elementClass);
	if (elementList == null) return;

	Array.prototype.forEach.call(elementList, function(element) {
		hideElement(element);
	});

}

function removeElementsByClass(elementClass){
	var elementList = document.getElementsByClassName(elementClass);
	if (elementList == null) return;

	Array.prototype.forEach.call(elementList, function(element) {
		element.remove();
	});
}


function onFindPlayer() {
	var userName = document.getElementById("findPlayerInput");

	if (userName == null || userName.value == ""){
		makeAlertError("Kullanıcı adı boş bırakılamaz.", 400);
		return;
	}
	if (userName.value.length > 16){
		makeAlertError("Kullanıcı adı maksimum 16 karakter olabilir", 400);
		return;
	}
	var resultText = document.getElementById("findPlayerResult");
	if (resultText == null) return;
	
	hideElement(resultText);

	setProcessButton("#find-button");

	$.ajax({
		type: "POST",
		url:  "posts/post-search.php",
		data : {
			username : userName.value
		},
		
		success: function(result){
			unsetProcessButton('#find-button');

			var data = JSON.parse(result);
			var resultType       = data.resultType;
			var resultID         = data.resultID;
			var resultMessage    = data.resultMessage;

			makeFindResult(resultMessage, resultType == "error" ? "t-error" : "t-success");

			if (resultID == 0 || resultID == 2){
				window.location.href = "oyuncu/" + userName.value;
			}
		}
	});
}

function setProcessButton(elementID){
	var element = $(elementID);

	var height = element.height();
	var width  = element.width();

	var processElement = htmlToElement('<div id="' + elementID + '-process" class="spinner a-center"><div class="bounce1 bg-white"></div><div class="bounce2 bg-white"></div><div class="bounce3 bg-white"></div></div>');
	$(processElement).css("width", width);
	$(processElement).css("height", height);

	$(processElement).attr("currentHTML", element.html());

	element.empty();
	element.html(processElement);
}

function unsetProcessButton(elementID){
	var element = $(elementID);

	var processElement = $(elementID + " > DIV");

	var currentHTML = $(processElement).attr("currentHTML");

	element.empty();
	element.html(currentHTML);
}

function makeFindResult(message, errorType){
	var resultText = document.getElementById("findPlayerResult");
	if (resultText == null) return;

	resultText.classList.remove("t-error");
	resultText.classList.remove("t-success");
	resultText.classList.add(errorType);

	resultText.innerHTML = message;
	setDisplayTable(resultText);
}


function onClickLogin() {
	if (isLoginProcess) return;

	var userName = document.getElementById("userName");

	if (userName == null || userName.value == ""){
		makeLoginResult("Kullanıcı adı boş bırakılamaz.", "t-error");
		return;
	}

	var passWord = document.getElementById("userPass");

	if (passWord == null || passWord.value == ""){
		makeLoginResult("Şifre boş bırakılamaz.", "t-error");
		return;
	}

	hideLoginResult();
	showLoginProcess();
	onLoginResult(userName.value, passWord.value);
}

var isForgotProcess = false;

function onClickForgotPass() {
	if (isForgotProcess) return;

	var userName = document.getElementById("forgotPassInput");

	if (userName == null || userName.value == ""){
		makeLoginResult("Kullanıcı adı veya e-posta girin.", "t-error");
		return;
	}

	onForgotPassResult(userName.value);
}

function onForgotPassResult(userName){
	hideLoginResult();

	setProcessButton('#forgotPassButton');

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-forgotpass.php",
			data: {
				value : userName,
			},
	
			success: function(result){
				isCodeProcess = false;

				unsetProcessButton('#forgotPassButton');
				var resultID = result.replace("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>", "");

				if (resultID == 0){
					makeLoginResult("E-posta gönderildi, lütfen kontrol edin.", "t-success");
				} else if (resultID == 1){
					makeLoginResult("Bu E-posta adresi mevcut değil.", "t-error");
				} else if (resultID == 2){
					makeLoginResult("Bu kullanıcı mevcut değil.", "t-error");
				} else if (resultID == 3){
					makeLoginResult("Zaten şifremi unuttum isteği gönderilmiş.", "t-error");
				} else if (resultID == 4){
					makeLoginResult("E-posta gönderme limiti geçilmiş.", "t-error");
				} else if (resultID == 5){
					makeLoginResult(ERROR_SYSTEM_MESSAGE, "t-error");
				}
			}
		});

	}, 1000);
}

var isCodeProcess = false;

function onClickCode() {
	if (isCodeProcess) return;

	var codeInput = document.getElementById("codeInput");

	hideCodeResult();
	onCodeResult(codeInput);
}

function onCodeResult(codeInput){
	if (codeInput == null || codeInput.value == null || codeInput.value == ""){
		makeCodeResult("Kod boş bırakılamaz.", "t-error");
		return;
	}
	var codeValue = codeInput.value;
	isCodeProcess = true;

	setProcessButton('#codeButton');

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-code.php",
			data: {
				code : codeValue,
			},
	
			success: function(result){
				isCodeProcess = false;

				unsetProcessButton('#codeButton');

				var data = JSON.parse(result);

				var resultID         = data.resultID;
				var resultMessage    = data.resultMessage;

				var coins = data.coins;
				var credits = data.credits;
				var crates = data.crates;
				var currentCrates = data.currentCrates;

				if (coins != -1){
					updateCoins(coins);
				}
				if (credits != -1){
					updateCredits(credits);
				}
				if (crates != -1){
					updateCrates(crates);
				}
				if (currentCrates != -1){
					updateCurrentCrates(currentCrates);
				}
				
				makeCodeResult(resultMessage, resultID == 0 ? "t-error" : "t-success");
			}
		});

	}, 1000);
}

var isRegisterProcess = false;

function onClickRegister() {
	if (isRegisterProcess) return;

	var userName = document.getElementById("registerUserName");
	var pass1 = document.getElementById("registerPassword1");
	var pass2 = document.getElementById("registerPassword2");
	var mail1 = document.getElementById("registerMail1");
	var mail2 = document.getElementById("registerMail2");

	var registerButton = document.getElementById("registerPageButton");
	onRegisterResult(userName.value, pass1.value, pass2.value, mail1.value, mail2.value);
}


function onRegisterResult(userName, pass1, pass2, mail1, mail2){
	isRegisterProcess = true;
	var response = grecaptcha.getResponse();

	setProcessButton('#registerPageButton');

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-register.php",

			data: { 
				username : userName, 
				password1 : pass1,
				password2 : pass2,
				email1 : mail1,
				email2 : mail2,
                registerTick: $('#registerTick').prop("checked"),
                mailTick: $('#mailTick').prop("checked"),
				"g-recaptcha-response" : response
			},
	
			success: function(result){
				isRegisterProcess = false;

				unsetProcessButton('#registerPageButton');

				var data = JSON.parse(result);

				var resultType       = data.resultType;
				var resultID         = data.resultID;
				var resultMessage    = data.resultMessage;
	
				if(resultID != null && resultID != 21 && resultID != 0){
					grecaptcha.reset();
				}

				makeRegisterResult(resultMessage, resultType == "success" ? "t-success" : "t-error");
			}
		});

	}, 1000);
}

function makeAlert(message, cooldown, type){
	var typeFix = type == "success" ? "rise-success" : "rise-danger";

	if (type == "success") {
		makeAlertSuccess(message, cooldown);
	} else {
		makeAlertError(message, cooldown);
	}
}

function makeGrowl(title, message, cooldown, type) {
	$.bootstrapGrowl('<strong>' + title + '</strong><br>' + message, { 
		type:  type,
		delay: cooldown,
	});
}

function makeAlertError(message, cooldown) {
	makeGrowl("HATA", message, cooldown, "rise-danger");
}

function makeAlertSuccess(message, cooldown) {
	makeGrowl("BAŞARILI", message, cooldown, "rise-success");
}

function hideCodeResult(){
	var resultText = document.getElementById("codeResultText");
	if (resultText == null) return;

	hideElement(resultText);
}

function hideLoginResult(){
	var resultText = document.getElementById("resultText");
	if (resultText == null) return;

	hideElement(resultText);
}

function makeLoginResult(message, errorType){
	var resultText = document.getElementById("resultText");
	if (resultText == null) return;

	resultText.classList.remove("t-error");
	resultText.classList.remove("t-success");
	resultText.classList.add(errorType);

	resultText.innerHTML = message;
	showElement(resultText);
}



function makeCodeResult(message, errorType){
	var resultText = document.getElementById("codeResultText");
	if (resultText == null) return;

	resultText.classList.remove("t-error");
	resultText.classList.remove("t-success");
	resultText.classList.add(errorType);
	
	resultText.innerHTML = message;
	showElement(resultText);
}


function makeRegisterResult(message, errorType){
	var resultText = document.getElementById("registerResultText");
	if (resultText == null) return;

	resultText.classList.remove("t-error");
	resultText.classList.remove("t-success");
	resultText.classList.add(errorType);
	
	resultText.innerHTML = message;
	showElement(resultText);
	setPageTop();
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

var closeBtn        = htmlToElement('<button id="closeBtn" onclick="closeModels()" style="color: white" class="close" data-dismiss="alert" type="button"><span aria-hidden="true">×</span><span class="sr-only">Kapat</span></button>');
var closeBtnBlack   = htmlToElement('<button id="closeBtn" onclick="closeModels()" style="color: black" class="close" data-dismiss="alert" type="button"><span aria-hidden="true">×</span><span class="sr-only">Kapat</span></button>');
var okeyButton      = htmlToElement('<div onclick="closeModels()" class="rise-button cr-light-orange m-8px br-3px d-inline-block"><p class="p-10px">TAMAM</p></div>');

var loadingIcon     = htmlToElement('<div class="spinner pr-80px"><div class="bounce1 bg-gray"></div><div class="bounce2 bg-gray"></div><div class="bounce3 bg-gray"></div></div>');
var successIcon     = htmlToElement('<span style="font-size: 120px; padding: 15px; color: #00D51F;"><i class="fas fa-check-circle"></i></span>');
var errorIcon       = htmlToElement('<span style="font-size: 120px; padding: 15px; color: #F03544;"><i class="fas fa-ban"></i></span>');

var cancelBtn  = htmlToElement('<div class="cancelBtn" onclick="closeModels()" id="buttons" style="float: right"><a style="font-size: 15px;" class="btn red">İPTAL</a></div>');

var tdItemCost  = htmlToElement('<td>Toplam Ücret</td>');
var tdItemName  = htmlToElement('<td style="color: gray; font-family: Gotham-Light;">Ürün adı:</td>');
var tdItemCat   = htmlToElement('<td style="color: gray; font-family: Gotham-Light;">Ürün kategorisi:</td>');
var tdItemSize  = htmlToElement('<td style="color: gray; font-family: Gotham-Light;">Ürün adedi:</td>');
var tdItemTime  = htmlToElement('<td style="color: gray; font-family: Gotham-Light;">Ürün süresi:</td>');

var tdItemSpace = htmlToElement('<tr><td></td><td></td></tr>');

var tdSizeSelector = htmlToElement('<td><select name="size"><option value="0">25</option><option value="0">50</option><option value="0">75</option><option value="0">100</option></select></td>');

function htmlToElements(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.childNodes;
}

function onConfirmItemBuy(itemId, itemName, itemAmount) {
	showLoadingButton();
	onItemResult(itemId, itemName, itemAmount);
}

function showLoadingButton(){
	var confirmBtn = document.getElementsByClassName('confirmBtn')[0];
	removeElement(confirmBtn);

	var cancelBtn = document.getElementsByClassName('cancelBtn')[0];
	removeElement(cancelBtn);

	var closeBtn = document.getElementById('closeBtn');
	removeElement(closeBtn);

	var footer = document.getElementsByClassName('footer')[0];
	
	footer.appendChild(loadingIcon);
}

var loginProcess = htmlToElement('<div id="loginProcess" style="width: 113px; height: 47px" class="spinner a-center"><div class="bounce1 bg-white"></div><div class="bounce2 bg-white"></div><div class="bounce3 bg-white"></div></div>');
var loginButtonText = htmlToElement('<p id="loginButtonText" class="p-10px">GİRİŞ YAP</p>');

function removeElementFromId(element, id){
	var e = element.getElementById(id);
	if (e == null) return;

	e.remove();
}
function addElement(element, addElement){
	element.appendChild(addElement);
}

var isLoginProcess = false;

function showLoginProcess(){
	if (isLoginProcess) return;

	isLoginProcess = true;
	var loginButtons = document.getElementById('loginButton');

	var loginText = document.getElementById('loginButtonText');
	loginText.remove();

	loginButtons.appendChild(loginProcess);

}
function hideLoginProcess(){
	if (!isLoginProcess) return;

	isLoginProcess = false;
	var loginButtons = document.getElementById('loginButton');

	var loginProcessIcon = document.getElementById('loginProcess');
	loginProcessIcon.remove();

	loginButtons.appendChild(loginButtonText);
}

var isItemBuyProcess = false;

function onItemResult(itemId, itemName, itemAmount) {
	isItemBuyProcess = true;

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-market.php",
			timeout: 5000,

			data : {
				amount: itemAmount,
				id : itemId
			},

			success: function(result){
				isItemBuyProcess = false;
				result = result.replace("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>", "");

				var data = JSON.parse(result);

				closeModels();
				var resultID = data.result;

				var coins = data.coins;
				var credits = data.credits;
				var crates = data.crates;
				var currentCrates = data.currentCrates;

				if (coins != -1){
					updateCoins(coins);
				}
				if (credits != -1){
					updateCredits(credits);
				}
				if (crates != -1){
					updateCrates(crates);
				}
				if (currentCrates != -1){
					updateCurrentCrates(currentCrates);
				}
				
				if (resultID == 0){
					onSuccessBuy(itemName);
				} else if (resultID == 1){
					onErrorBuy(itemName, "Giriş yapın.", "Oturum süreniz sonlanmış gibi gözüküyor.");
				} else if (resultID == 2){
					onErrorBuy(itemName, "Hatalı işlem", "Lütfen sayfayı yenileyip, tekrar deneyin.");
				} else if (resultID == 3){
					onErrorBuy(itemName, "Yetersiz bakiye", "Maalesef, bu ürünü alabilecek yeterli bakiye yok.");
				} else if (resultID == 4){
					onErrorBuy(itemName, "Bağlantı yok", "CraftRise sunucularına bağlantı başarısız, lütfen daha sonra tekrar dene.");
				} else {
					onErrorBuy(itemName, "Bilinmeyen bir hata.", "Hata kodu: " + resultID);
				}
			}
		});

	}, 1000);
}

function onLoginResult(playerName, playerPass){
	$.ajax({
		type: 'POST',
		data: { 
			value : playerName, 
			password : playerPass
		},
		url: "posts/post-login.php",
	
		success: function(result){
			hideLoginProcess();
			var data = JSON.parse(result);

			var resultType       = data.resultType;
			var resultMessage    = data.resultMessage;

			makeLoginResult(resultMessage, resultType == "success" ? "t-success" : "t-error");

			if (resultType == "success") {
				window.location.reload();
			}
		},
		error: function(){
			window.alert("Wrong query 'queryDB.php': " + query);
		}

	});
}

function onErrorBuy(itemName, errorName, errorMessage){
	closeModels();

	var model = document.createElement("DIV");
	model.id = "resultBox";
	setCurrentBoxModel(model);

	model.classList.add("item");
	
	var box = document.createElement("DIV");
	box.classList.add("box");
	
	box.style.minWidth = "400px";
	box.style.minHeight = "400px";
	
	var form = document.createElement("DIV");
	form.style.paddingTop = "30px";
	form.style.paddingBottom = "30px";
	form.style.display = "table-cell";
	form.style.textAlign = "center";
	form.style.margin = "0, auto";

	form.appendChild(errorIcon);
	form.appendChild(htmlToElement('<h3 class="p-10px f-gotham-bold">' + errorName + '</h3>'));
	form.appendChild(htmlToElement('<h3 class="p-10px f-gotham-light f-size-18px">' + errorMessage + '</h3>'));
	form.appendChild(okeyButton);

	box.appendChild(form);
	
	model.appendChild(box);
	
	document.body.appendChild(model);
	
	showElement(model);
}

function onSuccessBuy(itemName){
	closeModels();

	var model = document.createElement("DIV");
	model.id = "resultBox";
	setCurrentBoxModel(model);

	model.classList.add("item");
	
	var box = document.createElement("DIV");
	box.classList.add("box");
	
	box.style.minWidth = "400px";
	box.style.minHeight = "400px";
	
	var form = document.createElement("DIV");
	form.style.paddingTop = "30px";
	form.style.paddingBottom = "30px";
	form.style.display = "table-cell";
	form.style.textAlign = "center";
	form.style.margin = "0, auto";

	form.appendChild(successIcon);
	form.appendChild(htmlToElement('<h3 class="p-10px f-gotham-bold">Satın alma başarılı!</h3>'));
	form.appendChild(htmlToElement('<h3 class="p-10px f-gotham-light f-size-18px">' + itemName + ' adlı ürün satın alındı.</h3>'));
	form.appendChild(okeyButton);

	box.appendChild(form);
	
	model.appendChild(box);
	
	document.body.appendChild(model);
	
	showElement(model);
}

function openConfirmBox(onConfirm, onCancel){
	closeModels();

	var model = document.createElement("DIV");
	model.id = "confirmBox";
	setCurrentBoxModel(model);

	model.classList.add("item");
	
	var box = document.createElement("DIV");
	box.classList.add("box");
	
	var form = document.createElement("DIV");
	form.style.paddingTop = "30px";
	form.style.paddingBottom = "30px";
	form.style.display = "table-cell";
	form.style.textAlign = "center";
	form.style.margin = "0, auto";

	form.appendChild(htmlToElement('<h3 style="font-size: 40px;" class="p-10px f-gotham-bold">EMİN MİSİN?</h3>'));
	form.appendChild(htmlToElement('<h3 class="p-10px f-gotham-light f-size-18px">Bu işlem geri alınamayacaktır, emin misin?</h3>'));

	var confirmButton = htmlToElement('<div id="confirm-button" class="rise-button cr-green m-8px br-3px d-inline-block"><p class="p-10px">ONAYLA</p></div>');
	var cancelButton  = htmlToElement('<div id="cancel-button" class="rise-button cr-dark-red m-8px br-3px d-inline-block"><p class="p-10px">İPTAL</p></div>');

	$(confirmButton).click(onConfirm);
	$(cancelButton).click(onCancel);
	
	$(form).append(confirmButton);
	$(form).append(cancelButton);

	box.appendChild(form);
	
	model.appendChild(box);
	
	document.body.appendChild(model);
	
	showElement(model);
}

function openPasswordBox(){
	closeModels();

	var model = document.createElement("DIV");
	model.id = "password";
	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");
	$(box).css("height", "200px");

	$(box).append('<button onclick="openLoginBox()" class="prev" data-dismiss="alert" type="button"><span aria-hidden="true">&#8249;</span><span class="sr-only">Geri</span></button>');
	$(box).append(closeBtnBlack);
	$(box).append('<p style=" font-size: 30px;">YENİ ŞİFRE TALEBİ</p>');
	$(box).append('<p id="resultText" style="display: none;" class="f-gotham-book f-size-16px">.</p>');
	$(box).append('<input id="forgotPassInput" required="" class="form" placeholder="Kullanıcı adı veya e-posta" type="text" name="username">');
	$(box).append('<div class="align-items-parent"><div id="forgotPassButton" onclick="onClickForgotPass()" class="rise-button cr-light-orange m-8px align-items-item"><p class="p-10px">GÖNDER</p></div></div>');

	model.appendChild(box);
	document.body.appendChild(model);
	showElement(model);
}

function openRegisterBox(){
	closeModels();

	var model = document.createElement("DIV");
	model.id = "register";
	$(model).addClass("box-wrapper");

	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");
	$(box).css("width", "600px");

	$(box).append(closeBtnBlack);
	$(box).append('<p style=" font-size: 30px;">KAYIT OL</p>');
	$(box).append('<p id="resultText" style="display: none;" class="f-gotham-book f-size-16px">.</p>');

	var wrapper = document.createElement("DIV");
	$(wrapper).addClass("cr-form");

	var userInput = htmlToElement('<div class="m-10px"><input id="userName" placeholder="Kullanıcı adı" type="text"></div>');
	var passInput1 = htmlToElement('<div class="m-10px"><input id="userPass1" placeholder="Şifreniz" type="password"></div>');
	var passInput2 = htmlToElement('<div class="m-10px"><input id="userPass2" placeholder="Tekrar şifreniz" type="password"></div>');

	var mailInput1 = htmlToElement('<div class="m-10px"><input id="userMail1" placeholder="E-posta adresiniz" type="text"></div>');
	var mailInput2 = htmlToElement('<div class="m-10px"><input id="userMail2" placeholder="Tekrar E-posta adresiniz" type="text"></div>');

	var registerButton = htmlToElement('<div id="register-button" class="rise-button cr-green m-8px align-items-item"><p class="p-10px">KAYIT OL</p></div></div>');

	$(wrapper).append(userInput);
	$(wrapper).append(passInput1);
	$(wrapper).append(passInput2);
	$(wrapper).append(mailInput1);
	$(wrapper).append(mailInput2);
	
	$(wrapper).append(registerButton);

	$(box).append(wrapper);

	model.appendChild(box);
	document.body.appendChild(model);

	showElement(model);
}

function openLoginBox(){
	closeModels();

	var model = document.createElement("DIV");
	model.id = "login";

	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");
	$(box).css("width", "400px");
	$(box).append(closeBtnBlack);
	$(box).append('<p style=" font-size: 30px;">GİRİŞ YAP</p>');
	$(box).append('<p id="resultText" style="display: none;" class="f-gotham-book f-size-16px">.</p>');
	$(box).append('<form id="LoginForm" name="Login" action="Login" method="post"><input id="userName" class="form" placeholder="Kullanıcı adı veya e-posta" type="text" name="userName"><input id="userPass" class="form" placeholder="Şifreniz" type="password" name="userPassword"><div onclick="openPasswordBox()" style="width: 150px;" class="hoverText align-items-parent"><p class="align-items-item">Şifremi unuttum</p></div><div id="loginButtons" class="align-items-parent"><div id="loginButton" onclick="onClickLogin()" class="rise-button cr-light-orange m-8px align-items-item"><p id="loginButtonText" class="p-10px">GİRİŞ YAP</p></div><a href="kayit"><div id="registerButton" class="rise-button cr-green m-8px align-items-item"><p class="p-10px">KAYIT OL</p></div></div></a></form>');
	
	model.appendChild(box);
	document.body.appendChild(model);

	var userInput = $("#userName");
	userInput.keydown(function(e){
		if(e.keyCode == 13) {
			onClickLogin();
		}
	});

	var passInput = $("#userPass");
	passInput.keydown(function(e){
		if(e.keyCode == 13) {
			onClickLogin();
		}
	});
	
	showElement(model);
}

function openCodeBox(){
	closeModels();

	var model = document.createElement("DIV");
	model.id = "code";
	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");
	$(box).append(closeBtnBlack);
	$(box).append('<p style=" font-size: 30px;">KOD KULLAN</p>');
	$(box).append('<p style="display: none;" id="codeResultText" class="t-success f-gotham-book f-size-16px">.</p>');
	$(box).append('<form id="CodeForm" name="Code"><input id="codeInput" class="form" placeholder="Kodunuz" type="text" name="code"><div class="align-items-parent"><div onclick="onClickCode()" id="codeButton" class="rise-button cr-light-orange m-8px align-items-item"><p id="codeButtonText" class="p-10px">KULLAN</p></div></div></form>');

	model.appendChild(box);
	document.body.appendChild(model);

	showElement(model);
}

function updateCredits(value){
	var currentCredits = document.getElementById("currentCredits");
	if (currentCredits == null) return;

	currentCredits.innerHTML = value;
}

function updateCrates(value){
	var currentCrates = document.getElementById("currentCrates");
	if (currentCrates == null) return;
	
	currentCrates.innerHTML = value;
}
function updateCurrentCrates(value){
	var currentCrates = $("#currentCrates");
	if (currentCrates == null) return;
	
	currentCrates.attr("data-original-title", value);
}
function updateCoins(value){
	var currentCoins = document.getElementById("currentCoins");
	if (currentCoins == null) return;
	
	currentCoins.innerHTML = value;
}


function onItemAmountChange(itemAmount){
	var cost = this.getCurrentItemCost();

	var totalCost = document.getElementById("totalCost");

	totalCost.innerHTML = Math.round(cost * itemAmount) + " RC";

}

function onItemTimeChange(itemTimeName, itemMonth, itemDiscount){
	var itemCost = this.getCurrentItemCost();

	var totalCost = document.getElementById("totalCost");

	var lastCost = itemCost;

	if (itemDiscount != null){
		var timeCost = itemCost * itemMonth;
		lastCost = Math.round(timeCost - ((timeCost / 100) * itemDiscount));
	}

	totalCost.innerHTML = lastCost  + " RC";
}

function openItemBox(itemName, itemId, itemTimes, itemCost, itemAmounts, itemCategory, itemImageURL, itemDescription){
	closeModels();

	var itemDiscount = null;
	var timeSelector = null;
	var sizeSelector = null;

	var model = document.createElement("DIV");
	model.id = "itemBox";
	setCurrentBoxModel(model);
	setCurrentItemCost(itemCost);

	model.classList.add("item");
	
	var box = document.createElement("DIV");
	box.classList.add("box");
	box.style.width = "800px";
	box.style.padding = "0";
	model.appendChild(box);
	
	var header = document.createElement("DIV");
	header.classList.add("header");
	box.appendChild(header);
	
	var title = document.createElement("P");
	title.innerHTML = itemName.toUpperCase() + " SATIN ALIYORSUNUZ...";

	var closeButton = htmlToElement('<button id="closeBtn" onclick="closeModels()" style="color: white" class="close" data-dismiss="alert" type="button"><span aria-hidden="true">×</span><span class="sr-only">Kapat</span></button>');
	$(closeButton).css("padding", "20px");

	header.appendChild(closeButton);
	header.appendChild(title);
	
	var content = document.createElement("DIV");
	content.classList.add("content");
	
	box.appendChild(content);
	
	var imageDiv = document.createElement("DIV");
	imageDiv.classList.add("image");
	
	var image  = document.createElement("IMG");
	
	image.src = itemImageURL;
	
	if (itemCategory == "Özel Pelerinler"){
		image.style.maxWidth = "120px";
	}
	
	imageDiv.appendChild(image);
	content.appendChild(imageDiv);

	var text = document.createElement("DIV");
	text.classList.add("information");
	
	var table = document.createElement("TABLE");
	
	var tbody = document.createElement("TBODY");
	
	if (itemName != null){
		var trName = document.createElement("TR");
		trName.appendChild(tdItemName);
		
		var tdName = document.createElement("td");
		tdName.innerHTML = itemName;
		
		trName.appendChild(tdName);
		tbody.appendChild(trName);
	}
	
	if (itemCategory != null){
		var trCat = document.createElement("TR");
		trCat.appendChild(tdItemCat);
		
		var tdCat = document.createElement("TD");
		tdCat.innerHTML = itemCategory;

		trCat.appendChild(tdCat);
		tbody.appendChild(trCat);
	}
	
	if (itemAmounts != null){
		var trSize = document.createElement("TR");
		trSize.appendChild(tdItemSize);

		var tdSize = document.createElement("TD");
		
		sizeSelector = document.createElement("select");
		sizeSelector.name = "size";
		sizeSelector.id = "amountSelector";

		sizeSelector.addEventListener("change", function() {
			onItemAmountChange(sizeSelector.value);
		});
	
		var arr = JSON.parse(itemAmounts);

		Array.prototype.forEach.call(arr, function(amount) {
			var vSize = document.createElement("option");
			vSize.value = amount;
			vSize.innerHTML = amount;
			sizeSelector.appendChild(vSize);
		});

		tdSize.appendChild(sizeSelector);

		trSize.appendChild(tdSize);
		tbody.appendChild(trSize);
	}
	
	if (itemTimes != null){
		var trTime = document.createElement("TR");
		trTime.appendChild(tdItemTime);
		
		var tdTime = document.createElement("TD");

		var isMultiTime = itemTimes.includes(",");

		if (isMultiTime){
			timeSelector = document.createElement("select");
			timeSelector.name = "time";
			timeSelector.id = "timeSelector";
	
			timeSelector.addEventListener("change", function() {
				var itemTime = timeSelector.value;
	
				var vTime = document.getElementById("timeSelectorOption-" + itemTime);
	
				itemDiscount  = $(vTime).attr("discount");
				var itemMonth = $(vTime).attr("month");
	
				onItemTimeChange(itemTime, itemMonth, itemDiscount);
			});
	
			var arr = JSON.parse(itemTimes);
	
			Array.prototype.forEach.call(arr, function(str) {
				var split = str.includes(":") ? str.split(":") : null;
	
				var itemTime = split != null ? split[0] : itemTimes;
				var itemMonth = split != null ? split[1] : -1;
				var itemDiscount = split != null ? split[2] : -1;
	
				var vTime = document.createElement("option");
				vTime.id = "timeSelectorOption-" + itemTime;
	
				$(vTime).attr("discount", 	itemDiscount);
				$(vTime).attr("month", 		itemMonth);
	
				vTime.value = itemTime;
				vTime.innerHTML = itemTime;
				timeSelector.appendChild(vTime);
				tdTime.appendChild(timeSelector);
			});

		} else {
			tdTime.innerHTML = itemTimes;
		}


		trTime.appendChild(tdTime);
		tbody.appendChild(trTime);
	}
	
	tbody.appendChild(tdItemSpace);
	
	var trCost = document.createElement("TR");
	trCost.appendChild(tdItemCost);

	var arr = JSON.parse(itemAmounts);

	var totalCost = itemAmounts == null ? itemCost : itemCost * arr[0];

	if (itemDiscount != null) totalCost = dropPercent(itemCost, itemDiscount);

	var tdCost = document.createElement("TD");
	tdCost.id = "totalCost";
	tdCost.innerHTML = Math.round(totalCost) + " RC";
	
	trCost.appendChild(tdCost);
	
	tbody.appendChild(trCost);
	
	table.appendChild(tbody);
	text.appendChild(table);
	content.appendChild(text);
	
	var shopFooter = document.createElement("DIV");
	shopFooter.classList.add("footer");
	
	var info = document.createElement("P");
	info.innerHTML = itemDescription;
	
	shopFooter.appendChild(info);
	shopFooter.appendChild(cancelBtn);
	
	var confirmBtn = document.createElement("DIV");
	confirmBtn.id = "buttons";
	confirmBtn.style.float = "right";
	confirmBtn.onclick = function() {
		var amount = null;

		if (sizeSelector != null) {
			amount = sizeSelector.value;
		} else if (timeSelector != null){
			var vTime = document.getElementById("timeSelectorOption-" + timeSelector.value);
	
			var month =  $(vTime).attr("month");
			amount = month;
		}

		onConfirmItemBuy(itemId, itemName, amount);
	}
	
	var confirmLnk = document.createElement("A");
	confirmLnk.style.fontSize = "15px";
	confirmLnk.classList.add("btn");
	confirmLnk.classList.add("green");
	confirmLnk.classList.add("confirmBtn");

	confirmLnk.innerHTML = "SATIN AL";

	confirmBtn.appendChild(confirmLnk);
	
	shopFooter.appendChild(confirmBtn);

	box.appendChild(shopFooter);
	document.body.appendChild(model);
	
	showElement(model);
}

function dropPercent(integer, percent){
    return Math.round(integer - ((integer / 100) * percent));
}
function addPercent(integer, percent){
	return Math.round(integer + ((integer / 100) * percent));
}

function onPasswordChange(){
	var currentPass = document.getElementById("currentPass");
	var newPass1 = document.getElementById("newPass1");
	var newPass2 = document.getElementById("newPass2");
	
	if (currentPass.value == null || currentPass.value == ""){
		$.bootstrapGrowl("Mevcut şifre boş bırakılamaz.", { 
	    	type: 'rise-danger',
	    	delay: 600,
	    });
		return;
	}
	if (newPass1.value == null || newPass1.value == "" || newPass2.value == null || newPass2.value == ""){
		$.bootstrapGrowl("Yeni şifre boş bırakılamaz.", { 
	    	type: 'rise-danger',
	    	delay: 600,
	    });
		return;
	}
	if (newPass1 != newPass2){
		$.bootstrapGrowl("Şifreler birbirine eş değil.", { 
	    	type: 'rise-danger',
	    	delay: 600,
	    });
		return;
	}
	$.bootstrapGrowl("Şifre değiştirme onay maili gönderildi.", { 
    	type: 'rise-success',
    	delay: 900,
    });
}

function onEmailChange(){
	var mail = document.getElementById("newmail");
	var isNull = mail.value == null || mail.value == "";
	var isMail = mail.value.includes("@");
	
	if (isNull) {
		$.bootstrapGrowl("Yeni e-posta boş bırakılamaz.", { 
	    	type: 'rise-danger',
	    	delay: 600,
	    });
		return;
	}
	if (!isMail) {
		$.bootstrapGrowl("Yeni e-posta yazılmalıdır.", { 
	    	type: 'rise-danger',
	    	delay: 600,
	    });
		return;
	}

	$.bootstrapGrowl("E-posta değiştirme onay maili gönderildi.", { 
    	type: 'rise-success',
    	delay: 900,
    });
}

function onClickUpdateSettings(){
	setProcessButton('#updateSettingsButton');

	var name = $('#nameAndSurnameInput').val();

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-profile.php",

			data : {
				postType: "GENERAL_INFO",
				nameAndSurname : $('#nameAndSurnameInput').val(),
				discord: $('#discordNameInput').val(),
				instagram: $('#instagramNameInput').val(),
				youtube: $('#youtubeNameInput').val(),

				youtubeTick: $('#youtubeTick').prop("checked"),
				instagramTick: $('#instagramTick').prop("checked"),
				nameAndSurnameTick: $('#nameAndSurnameTick').prop("checked"),
				discordTick: $('#discordTick').prop("checked")
			},

			success: function(result){
				unsetProcessButton('#updateSettingsButton');

				var data = JSON.parse(result);

				var resultType = data.resultType;
				var resultMessage = data.resultMessage;

				makeAlert(resultMessage, 600, resultType);
			}
		});
	}, 1000);
}

function onClickNewPassword(){
	setProcessButton('#newPasswordButton');

	var pass1 = $('#newPass1').val();
	var pass2 = $('#newPass2').val();
	var activationKey = $('#activationKey').val();

	if (pass1 == null || pass1 == "" || pass2 == null || pass2 == ""){
		makeAlert("Şifreler boş olmamalıdır.", 600, "error");
		return;
	}
	if (pass1 != pass2){
		makeAlert("Şifreler birbirine eş değil.", 600, "error");
		return;
	}

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-newpass.php",
			
			data : {
				"activation-key": activationKey,
				password1: pass1,
				password2: pass2,
			},

			success: function(result){
				unsetProcessButton('#newPasswordButton');

				var resultID = result.replace("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>", "");

				if (resultID == 0){

					var wrapper = $("#result-wrapper");
					wrapper.empty();
					wrapper.append('<span style="font-size: 120px; padding: 15px; color: #00D51F;"><i class="fas fa-check-circle"></i></span>');
					wrapper.append('<p class="f-gotham-book f-size-20px">Şifren başarıyla değiştirildi.</p>');

				} else if (resultID == 1){
					makeAlert("Şifreler boş olmamalıdır.", 600, "error");
				} else if (resultID == 2){
					makeAlert("Şifreler birbirine eş değil.", 600, "error");
				} else if (resultID == 3){
					makeAlert(ERROR_SYSTEM_MESSAGE, 600, "error");
				} else if (resultID == 4){
					makeAlert("Şifreniz çok kısa, daha uzun bir şifre belirleyin.", 600, "error");
				} else if (resultID == 5){
					makeAlert("Şifreniz çok uzun, daha kısa bir şifre belirleyin.", 600, "error");
				} else if (resultID == 6){
					makeAlert("Şifreniz eski şifreyle aynı, yeni bir şifre belirleyin.", 600, "error");
				}
			}
		});
	}, 1000);

}

function onClickChangeCountry(){
	setProcessButton('#changeCountryButton');

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-profile.php",
			
			data : {
				postType: "CHANGE_COUNTRY",
				country : $('#country-selector').val(),
			},

			success: function(result){
				unsetProcessButton('#changeCountryButton');

				var data = JSON.parse(result);

				var resultType = data.resultType;
				var resultMessage = data.resultMessage;

				makeAlert(resultMessage, 600, resultType);
			}
		});
	}, 1000);
}

function onClickChangePassword(){
	setProcessButton('#changePasswordButton');

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-profile.php",
			
			data : {
				postType: "CHANGE_PASSWORD",
				currentPass : $('#currentPass').val(),
				newPass1: $('#newPass1').val(),
				newPass2: $('#newPass2').val(),
			},

			success: function(result){
				unsetProcessButton('#changePasswordButton');

				var data = JSON.parse(result);

				var resultType = data.resultType;
				var resultMessage = data.resultMessage;

				makeAlert(resultMessage, 600, resultType);
			}
		});
	}, 1000);
}

function onClickChangeEmail(){
	setProcessButton('#changeMailButton');

	setTimeout(function() {
		$.ajax({
			type: "POST",
			url:  "posts/post-profile.php",
			
			data : {
				postType: "CHANGE_MAIL",
				currentPass : $('#changeMail-currentPasswordInput').val(),
				newMail: $('#changeMail-newMailInput').val()
			},

			success: function(result){
				unsetProcessButton('#changeMailButton');

				var data = JSON.parse(result);

				var resultType = data.resultType;
				var resultMessage = data.resultMessage;

				makeAlert(resultMessage, 600, resultType);
			}
		});
	}, 1000);
}

function dataURLtoFile(dataurl, filename) {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), 
		n = bstr.length, 
		u8arr = new Uint8Array(n);
		
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	
	return new File([u8arr], filename, {type:mime});
}

function loadCharImage(charType, fileURL) {
	var file = document.getElementById("loadInput").files[0];

	var formData = new FormData();
	formData.append("file", file);
	formData.append("charType", charType.toUpperCase());

	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (this.readyState === 4 && this.status === 200) {
			unsetProcessButton('#upload-button');

			var data = JSON.parse(this.responseText);

			var resultType       = data.resultType;
			var resultID         = data.resultID;
			var resultMessage    = data.resultMessage;

			makeAlert(resultMessage, 400, resultType);

			if (resultID == 0){
				closeModels();
				if (charType == "Skin"){
					setSkinURL(URL.createObjectURL(file));
				}
				if (charType == "Cape"){
					setCapeURL(URL.createObjectURL(file));
				}

			}
		}
	}
	ajax.open("POST", fileURL, true);
	ajax.send(formData);
}

function onClickLoadSkin(){
	closeModels();

	var model = document.createElement("DIV");
	model.classList.add("box-wrapper");
	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");
	$(box).append('<p style=" font-size: 30px;">SKIN YÜKLE</p>');

	var uploadBtnWrapper = htmlToElement('<div class="upload-btn-wrapper"><button class="btn-upload">DOSYA SEÇ</button><input id="loadInput" type="file"/></div>');
	box.appendChild(uploadBtnWrapper);
	//setupUploadButton(uploadBtnWrapper);
	$(box).append('<br>');

	var uploadButton = htmlToElement('<div id="upload-button" class="rise-button cr-green m-5px br-3px d-inline-block"><p class="f-size-15px p-10px">YÜKLE</p></div>');
	$(box).append(uploadButton);

	model.appendChild(box);
	document.body.appendChild(model);


	$(uploadButton).click(function() {
		setProcessButton('#upload-button');

		loadCharImage("Skin", "posts/post-loadchar.php");
	});

	showElement(model);
}

function onClickLoadCape(){
	closeModels();

	var model = document.createElement("DIV");
	model.classList.add("box-wrapper");
	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");
	$(box).append('<p style=" font-size: 30px;">PELERİN YÜKLE</p>');
	$(box).append('<div class="upload-btn-wrapper"><button class="btn-upload">DOSYA SEÇ</button><input id="loadInput" type="file"/></div><br>');

	var uploadButton = htmlToElement('<div id="upload-button" class="rise-button cr-green m-5px br-3px d-inline-block"><p class="f-size-15px p-10px">YÜKLE</p></div>');
	$(box).append(uploadButton);

	model.appendChild(box);
	document.body.appendChild(model);

	$(uploadButton).click(function() {
		setProcessButton('#upload-button');

		loadCharImage("Cape", "posts/post-loadchar.php");
	});

	showElement(model);
}


function onClickClanLoadCape(){
	closeModels();

	var model = document.createElement("DIV");
	model.classList.add("box-wrapper");
	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");
	$(box).append('<p style=" font-size: 30px;">PELERİN YÜKLE</p>');
	$(box).append('<div class="upload-btn-wrapper"><button class="btn-upload">DOSYA SEÇ</button><input id="loadInput" type="file"/></div><br>');

	var uploadButton = htmlToElement('<div id="upload-button" class="rise-button cr-green m-5px br-3px d-inline-block"><p class="f-size-15px p-10px">YÜKLE</p></div>');
	$(box).append(uploadButton);

	model.appendChild(box);
	document.body.appendChild(model);

	$(uploadButton).click(function() {
		setProcessButton('#upload-button');

		loadCharImage("Cape", "posts/post-loadclancape.php");
	});

	showElement(model);
}

function getWingName(id){
	if (id == 1){
		return "Siyah (Beyaz Dalgalı)";
	} else if (id == 2){
		return "Siyah (Mor Dalgalı)";
	} else if (id == 3){
		return "Turuncu (Kırmızı Dalgalı)";
	} else if (id == 4){
		return "Kırmızı";
	} else if (id == 5){
		return "Mavi";
	} else if (id == 6){
		return "Turuncu (Sarı Dalgalı)";
	} else if (id == 7){
		return "Kırmızı (Gri Dalgalı)";
	} else if (id == 8){
		return "Mor Dalgalı";
	} else if (id == 9){
		return "Sarı Dalgalı";
	} else if (id == 11){
		return "Yeşil Dalgalı";
	} else if (id == 12){
		return "Turuncu Dalgalı";
	} else if (id == 13){
		return "Pembe Dalgalı";
	} else if (id == 14){
		return "Siyah Kanat";
	} else if (id == 15){
		return "Siyah Kanat";
	}
}

function isColorable(wingName) {
	return wingName == "ANGEL" || wingName == "MECH";
}

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

function onClickLoadHat(){
	closeModels();

	var model = document.createElement("DIV");
	model.classList.add("box-wrapper");
	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");

	$(box).append('<p style=" font-size: 30px;">ŞAPKA SEÇ</p>');

	var wrapper = document.createElement("DIV");
	wrapper.id = "hatselector";

	$(wrapper).addClass("align-items-parent");
	$(wrapper).css("height", "auto");
	$(wrapper).css("border-radius", "solid 1px red");

	const hats = ['TOPHAT', 'FEZ', 'LEGO', 'RABBIT', 'CONE', 'CROWN', 'SANTA', 'PIPET'];

	hats.forEach(function(element) {
		var hatItem = document.createElement("DIV");
		$(hatItem).addClass("hatItem");
		$(hatItem).addClass("align-items-item");
		
		var hatItemImage = document.createElement("IMG");
		hatItemImage.src = "images/hats/HATS_" + element + ".png";

		var hatItemSelectButton = htmlToElement('<div id="' + element + '-hatbutton" class="rise-button cr-light-orange m-8px"><p class="f-size-15px f-gotham-book p-5px">SEÇ</p></div>');
		$(hatItemSelectButton).css("display", "inline-block");

		hatItemSelectButton.onclick = function() {
			var text = $(hatItemSelectButton).children('p').html();

			var isCancelClick = text == "İPTAL";

			if (isCancelClick) {

				$(hatItemSelectButton).removeClass("cr-dark-red");
				$(hatItemSelectButton).addClass("cr-light-orange");
				$(hatItemSelectButton).children('p').html("SEÇ");
				setSelectedHatType(null);

			} else {
				var hatSelect = getSelectedHatType();
				if (hatSelect != null) {
					var button = $("#" + hatSelect  + "-hatbutton");

					$(button).removeClass("cr-dark-red");
				    $(button).addClass("cr-light-orange");
				    $(button).children('p').html("SEÇ");
				}

				$(hatItemSelectButton).removeClass("cr-light-orange");
				$(hatItemSelectButton).addClass("cr-dark-red");
				$(hatItemSelectButton).children('p').html("İPTAL");

				setSelectedHatType(element);
				$("#colorPick").addClass("d-none");
				$("#colorPick").removeClass("d-block");

			}
		}

		hatItem.appendChild(hatItemImage);
		hatItem.appendChild(hatItemSelectButton);
		wrapper.appendChild(hatItem);
	});

	box.appendChild(wrapper);

	$(box).append(htmlToElement('<div id="savewing-button" onclick="onClickSaveHat() "class="rise-button cr-green m-5px br-3px d-inline-block"><p class="f-size-15px p-10px">KAYDET</p></div>'))

	model.appendChild(box);
	document.body.appendChild(model);

	showElement(model);
	
}

function onClickSaveHat() {
	var hat = getSelectedHatType();
	if (hat == null) {
		makeAlertError("Lütfen bir şapka seçiniz.", 1500);
		return;
	}

	setProcessButton("#savehat-button");
	$.ajax({
		type: "POST",
		url:  "posts/post-loadchar.php",
		data : {
			hatName : "HAT_" + hat,
			charType : "HATS",
		},
		
		success: function(result){
			unsetProcessButton("#savehat-button");
			var resultID = result.replace("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>", "");

			var data = JSON.parse(result);

			var resultType       = data.resultType;
			var resultID         = data.resultID;
			var resultMessage    = data.resultMessage;

			makeAlert(resultMessage, 900, resultType);

			if (resultID != null && resultID == 0){
				closeModels();
			}
		}
	});
}

function onClickLoadWing(){
	closeModels();

	var model = document.createElement("DIV");
	model.classList.add("box-wrapper");
	setCurrentBoxModel(model);

	var box = document.createElement("DIV");
	$(box).addClass("box");

	$(box).append('<p style=" font-size: 30px;">KANAT SEÇ</p>');

	var wrapper = document.createElement("DIV");
	wrapper.id = "wingselector";

	$(wrapper).addClass("align-items-parent");
	$(wrapper).css("height", "auto");
	$(wrapper).css("border-radius", "solid 1px red");

	const wings = ['ANGEL', 'BLACK', 'MECH', 'METAL', 'SHANA'];

	wings.forEach(function(element) {
		var wingItem = document.createElement("DIV");
		$(wingItem).addClass("wingItem");
		$(wingItem).addClass("align-items-item");
		
		var wingItemImage = document.createElement("IMG");
		wingItemImage.src = "images/wings/WINGS_" + element + ".png";

		var wingItemSelectButton = htmlToElement('<div id="' + element + '-wingbutton" class="rise-button cr-light-orange m-8px"><p class="f-size-15px f-gotham-book p-5px">SEÇ</p></div>');
		$(wingItemSelectButton).css("display", "inline-block");

		wingItemSelectButton.onclick = function() {
			var text = $(wingItemSelectButton).children('p').html();

			var isCancelClick = text == "İPTAL";

			if (isCancelClick) {

				$(wingItemSelectButton).removeClass("cr-dark-red");
				$(wingItemSelectButton).addClass("cr-light-orange");
				$(wingItemSelectButton).children('p').html("SEÇ");
				setSelectedWingType(null);

			} else {
				var wingSelect = getSelectedWingType();
				if (wingSelect != null) {
					var button = $("#" + wingSelect  + "-wingbutton");

					$(button).removeClass("cr-dark-red");
				    $(button).addClass("cr-light-orange");
				    $(button).children('p').html("SEÇ");
				}

				$(wingItemSelectButton).removeClass("cr-light-orange");
				$(wingItemSelectButton).addClass("cr-dark-red");
				$(wingItemSelectButton).children('p').html("İPTAL");

				setSelectedWingType(element);
				if (isColorable(element)) {
					$("#colorPick").removeClass("d-none");
					$("#colorPick").addClass("d-block");
				} else {
					$("#colorPick").addClass("d-none");
					$("#colorPick").removeClass("d-block");
				}

			}
		}

		wingItem.appendChild(wingItemImage);
		wingItem.appendChild(wingItemSelectButton);
		wrapper.appendChild(wingItem);
	});

	box.appendChild(wrapper);

	$(box).append(htmlToElement('<div style="margin-bottom: 50px;" id="colorPick" class="d-none"><p>KANAT RENGİ SEÇ</p><canvas id="picker" width="150" height="150" style="width: 150px;height: 150px;"></canvas><br><br><div class="cr-form"><input class="rise-form" id="color" value="#54aedb"></div></div>'));
	
	$(box).append(htmlToElement('<div id="savewing-button" onclick="onClickSaveWing() "class="rise-button cr-green m-5px br-3px d-inline-block"><p class="f-size-15px p-10px">KAYDET</p></div>'))

	model.appendChild(box);
	document.body.appendChild(model);

	showElement(model);

	new KellyColorPicker({place : 'picker', input : 'color', size : 150});
	
}

function onClickSaveWing() {
	var wing = getSelectedWingType();
	if (wing == null) {
		makeAlertError("Lütfen bir kanat seçiniz.", 1500);
		return;
	}

	setProcessButton("#savewing-button");

	var hex = $("#color").val();
	hex = hex.replace('#','');

	var latest = isColorable(wing) ? parseInt(hex, 16) : 0;

	$.ajax({
		type: "POST",
		url:  "posts/post-loadchar.php",
		data : {
			wingName : "WINGS_" + wing,
			wingColor : latest,
			charType : "WINGS",
		},
		
		success: function(result){
			unsetProcessButton("#savewing-button");
			var resultID = result.replace("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>", "");

			if (resultID == 0){
				closeModels();
				makeAlert("Kanat başarıyla seçildi.", 800, "success");
			} else if  (resultID == 1){
				makeAlert("Hata oluştu.", 800, "error");
			} else if (resultID == 7){
				makeAlert("Bu özelliği kullanabilmek için skin üyeliği almanız gerekiyor.", 800, "error");
			} else if (resultID == 8){
				makeAlert("Bu özelliği kullanabilmek için pelerin üyeliği almanız gerekiyor.", 800, "error");
			} else if (resultID == 9){
				makeAlert("Bu özelliği kullanabilmek için kanat üyeliği almanız gerekiyor.", 900, "error");
			}
		}
	});
}

function writeGeneralLeaders(content){
	var table = $("#leaders-generaltable");

	table.removeClass();
	
	table.addClass("table");
	table.addClass("table-striped");
	table.addClass("table-hover");

	table.addClass("animated");
	table.addClass("zoomIn");
	table.addClass("faster");

	table.empty();
	table.append(content);
}

function writePlayerStats(content){
	var table = $("#leaders-playertable");

	table.removeClass();

	table.addClass("table");
	table.addClass("table-striped");
	table.addClass("table-hover");

	table.addClass("animated");
	table.addClass("zoomIn");
	table.addClass("faster");

	table.empty();
	table.append(content);
}

function onClickSeasonPlayer(){
	var userName = $("#leaders-username").val();

	setProcessButton("#leaders-findbutton");

	$.ajax({
		type: "POST",
		url:  "posts/post-statsplayer.php",
		data : {
			username: userName,
		},
		
		success: function(result){
			unsetProcessButton("#leaders-findbutton");

			var result = result.replace("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>", "");
			writePlayerStats(result);
		}
	});
}

function setSeasonSelector(selector){
	var timeSelector = $("#leaders-timeSelector");

	timeSelector.empty();
	timeSelector.append(selector);
}

function onChangeSeasonVariables(value){
	var game = $("#leaders-gameSelector").val();
	var type = $("#leaders-typeSelector").val();

	$.ajax({
		type: "POST",
		url:  "posts/post-getseasonlist.php",
		data : {
			seasonGame: game,
			seasonType: type,
		},
		
		success: function(result){
			var result = result.replace("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>", "");

			setSeasonSelector(result);
		}
	});
}

function post(postURL, postData, postSuccess) {
	$.ajax({
		type: "POST",
		url:  postURL,
		data: postData,
		success: postSuccess
	});
}

function onClickClanColor(colorElement) {
	var oldElement = this.getSelectedClanColor();

	if (oldElement != null) {
		$(oldElement).css("box-shadow", "");
		$(oldElement).css("border-radius", "3px");
		this.setSelectedClanColor(null);
	}

	$(colorElement).css("box-shadow", "inset 0 0 4px 2px #fff");
	$(colorElement).css("border-radius", "10px");
	
	this.setSelectedClanColor(colorElement);
}

function onClickSeasonList(){
	var game = $("#leaders-gameSelector").val();
	var type = $("#leaders-typeSelector").val();
	var time = $("#leaders-timeSelector").val();

	setProcessButton("#list-button");

	$.ajax({
		type: "POST",
		url:  "posts/post-statsgeneral.php",
		data : {
			seasonGame: game,
			seasonType: type,
			seasonTime: time
		},
		
		success: function(result){
			unsetProcessButton("#list-button");

			var result = result.replace("<meta http-equiv='Content-Type' content='text/html; charset=utf-8'/>", "");

			writeGeneralLeaders(result);
		}
	});

}


function removeModels(){
	removeElementsById(modelElements);
}

function closeModels() {
	removeCurrentBoxModel();
}

function onCloseModel(model){
	if (model.id == "itemBox" && isItemBuyProcess){
		return false;
	}
	if (model.id == "code" && isCodeProcess){
		return false;
	}
	if (model.id == "credit") {
		return false;
	}
	this.setCurrentItemCost(null);
	return true;
}


function setPageTop(){
	$('html, body').animate({ scrollTop: 0 }, 'fast');
}


function createRiseButton(id, text, margin, color, radius, display, padding){
	var riseButton = document.createElement("DIV");

	riseButton.id = id;
	riseButton.classList.add("rise-button");
	riseButton.classList.add(margin);
	riseButton.classList.add(color);
	riseButton.classList.add(radius);
	riseButton.classList.add(display);

	var riseButtonText = document.createElement("P");
	riseButtonText.classList.add(padding);
	riseButtonText.innerHTML = text;

	riseButton.appendChild(riseButtonText);

	return riseButton;
}

function createBackButton(text){
	var backButton = document.createElement("DIV");

	backButton.id = "back-button";
	backButton.classList.add("rise-button");
	backButton.classList.add("m-15px");
	backButton.classList.add("cr-light-orange");
	backButton.classList.add("br-3px");
	backButton.classList.add("d-inline-block");

	var backButtonText = document.createElement("P");
	backButtonText.classList.add("p-10px");
	backButtonText.innerHTML = text;

	backButton.appendChild(backButtonText);

	return backButton;
}

function getMaxWidth(){
	return $('html').css('max-width');
}

function getMaxHeight(){
	return $('html').css('max-height');
}

function isHide(element){
	return $(element).css("display") == "none";
}

function isEmpty(value){
	value = replaceAll(value, " ", "");
	
	return value == null || value == "";
}

function makeInputError(input){
	input.css("border", "solid 0.5px red");

	addAnimate(input[0], "shake", "fast", function() {
		input.css("border", "");
	});
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function addAnimate(element, animationName, animationSpeed, callback) {
	$(element).addClass(animationName);
	$(element).addClass(animationSpeed);
	$(element).addClass("animated");

    function handleAnimationEnd() {
		$(element).removeClass(animationName);
		$(element).removeClass(animationSpeed);
		$(element).removeClass("animated");

        element.removeEventListener('animationend', handleAnimationEnd);

        if (typeof callback === 'function') callback();
    }

    element.addEventListener('animationend', handleAnimationEnd);
}


function animateCSS(node, animationName, callback) {
    node.classList.add('animated', animationName);

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName);
        node.removeEventListener('animationend', handleAnimationEnd);

        if (typeof callback === 'function') callback();
    }

    node.addEventListener('animationend', handleAnimationEnd);
}


const nav = document.querySelector('#nav');
const menu = document.querySelector('#menu');
const menuToggle = document.querySelector('.nav__toggle');
let isMenuOpen = false;


// TOGGLE MENU ACTIVE STATE
menuToggle.addEventListener('click', e => {
	e.preventDefault();
	isMenuOpen = !isMenuOpen;

	// toggle a11y attributes and active class
	menuToggle.setAttribute('aria-expanded', String(isMenuOpen));
	menu.hidden = !isMenuOpen;
	nav.classList.toggle('nav--open');
});


// TRAP TAB INSIDE NAV WHEN OPEN
nav.addEventListener('keydown', e => {
	// abort if menu isn't open or modifier keys are pressed
	if (!isMenuOpen || e.ctrlKey || e.metaKey || e.altKey) {
		return;
	}
  
	// listen for tab press and move focus
	// if we're on either end of the navigation
	const menuLinks = menu.querySelectorAll('.nav__link');
	if (e.keyCode === 9) {
	if (e.shiftKey) {
		if (document.activeElement === menuLinks[0]) {
		menuToggle.focus();
		e.preventDefault();
		}
	} else if (document.activeElement === menuToggle) {
		menuLinks[0].focus();
		e.preventDefault();
	}
	}
});
