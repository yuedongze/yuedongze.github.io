var parsed;
i = 0;
var vmode = $("#vmode").find("option:selected").text();
var totalbw = 0;

function printable() {
	var d = document.getElementById('debug');
	var mode = d.getElementsByClassName("outmode");
	var qty = d.getElementsByClassName("qty");
	var imgno = d.getElementsByClassName("imageno");
	var ar = d.getElementsByClassName("ar");
	var codec = d.getElementsByClassName("codec");
	var resolution = d.getElementsByClassName("resolution");
	var bitrate = d.getElementsByClassName("bitrate");
	var frate = d.getElementsByClassName("frate");
	var audio = d.getElementsByClassName("audio");
	var bw = d.getElementsByClassName("bandwidth");
	var storage = d.getElementsByClassName("storage");
	var act = d.getElementsByClassName("act");
	var oh = d.getElementsByClassName("oh");
	var dh = document.getElementById('dayhr');
	var sp = document.getElementById('totalsc');
	var tbw = document.getElementById('tbw');
	var tstr = document.getElementById('tstr');
	var camno = document.getElementById('camno');
	var gigs = parseInt(document.getElementById('gigs').value);
	var days = parseInt(document.getElementById('days').value);
	var win = window.open();
	html = "<h1>"+parsed["manufacturer"] + " " + parsed["support_model"][0] +" Network Camera Storage Calculator</h1>";
	
	// Create table
	html += "<table border=1><tr><th>Output Mode</th><th>Qty</th><th>Image No.</th><th>Aspect Ratio</th><th>Codec</th><th>Image Resolution</th><th>Bit Rate(Quality)</th><th>Frame Rate</th><th>Audio</th><th>Operation Hours</th><th>Activity</th><th>Bandwidth Req</th><th>Storage Req</th></tr>";
	
	// loop over the table
	for (var i = 0; i < mode.length; i++){
		if (mode[i].options[mode[i].selectedIndex].value == "--Choose Output Mode--"){
			continue;
		}
		
		html += "<tr>";
		html += "<td>";
		html += mode[i].options[mode[i].selectedIndex].value;
		html += "</td>";
		
		html += "<td>";
		html += qty[i].value;
		html += "</td>";
		
		html += "<td>";
		html += "Image "+imgno[i].options[imgno[i].selectedIndex].value;
		html += "</td>";
		
		html += "<td>";
		html += ar[i].options[ar[i].selectedIndex].value;
		html += "</td>";
		
		html += "<td>";
		html += codec[i].options[codec[i].selectedIndex].value;
		html += "</td>";
		
		html += "<td>";
		html += resolution[i].options[resolution[i].selectedIndex].value;
		html += "</td>";
		
		html += "<td>";
		html += bitrate[i].options[bitrate[i].selectedIndex].text;
		html += "</td>";
		
		html += "<td>";
		html += frate[i].options[frate[i].selectedIndex].value;
		html += "</td>";
		
		html += "<td>";
		html += audio[i].options[audio[i].selectedIndex].text;
		html += "</td>";
		
		html += "<td>";
		html += oh[i].options[oh[i].selectedIndex].value;
		html += "</td>";
		
		html += "<td>";
		html += act[i].options[act[i].selectedIndex].value;
		html += "</td>";
		
		html += "<td>";
		html += showkb(bw[i].value);
		html += "</td>";
		
		html += "<td>";
		html += storage[i].value.toFixed(2) + "GB/day";
		html += "</td>";
		
		html += "</tr>";
	}
	
	html += "</table>";
	
	html += "<p>Totals: "+ camno.innerHTML +" Camera(s).<br>";
	html += "<p>Total Bandwidth: "+ tbw.innerHTML +".<br>";
	html += "<p>Total Storage: "+ tstr.innerHTML +".<br>";
	
	html += "<p><h2>Storage capacity required for " + days + " Days will be approximately " + dh.innerHTML + ".</h2>";
	
	html += "<h2>Storage capacity of " + gigs + " will last approximately " + sp.innerHTML + ".</h2>";
	
	html += "<div style='text-align: right'><a href=# onclick='window.print()'>Print this page</a></div>"; 
	
	$(win.document.body).html(html);
}

function updateFR() {
	var d = document.getElementById('debug');
	var res = d.getElementsByClassName('frate');
	var mode = d.getElementsByClassName("outmode");
	var imgno = d.getElementsByClassName("imageno");
	var ar = d.getElementsByClassName("ar");
	
	for (var z=0; z < res.length; z++) {
		// clear frate frame
		while (res[z].firstChild) {
		    res[z].removeChild(res[z].firstChild);
		}
		
		// locate the corresponding mode & img
		for (var i in parsed["db"]["modes"]){
			var tmp = parsed["db"]["modes"][i];
			try{
			if (tmp["mode"] == mode[z].options[mode[z].selectedIndex].value){
				for (var j in tmp["image"]){
					if (tmp["image"][j]["id"] == imgno[z].options[imgno[z].selectedIndex].value){
						var tmp2 = tmp["image"][j][ar[z].options[ar[z].selectedIndex].value]["frate"][vmode];
						for (var m in tmp2){
							var opt = document.createElement("option");
							opt.setAttribute("value", tmp2[m]);
							var txt = document.createTextNode(tmp2[m]);
							opt.appendChild(txt);
							res[z].appendChild(opt);
						}
					}
				}
			}
			} catch (err) {window.alert(z);}
		}
	}
	
	
}

function calcstr(kbps, oh, act){
	return (1000*kbps*oh*3600*act/8/1073741824/100);
}

function showkb(kb){
	var result;
	if (kb >= 1000) {
		if (kb >= 1000*1000) {
			result = (kb/1000/1000).toFixed(2) + "gbps";
		} else {
			result = (kb/1000).toFixed(2) + "mbps";
		}
		
	} else {
		result = (kb).toFixed(2) + "kbps";
	}
	
	return result;
}

function updateBW() {
	var d = document.getElementById('debug');
	var res = d.getElementsByClassName('storage');
	var bwres = d.getElementsByClassName('bandwidth');
	var chk = d.getElementsByClassName('checkbox');
	var dh = document.getElementById('dayhr');
	var sp = document.getElementById('totalsc');
	var tbw = document.getElementById('tbw');
	var tstr = document.getElementById('tstr');
	var camno = document.getElementById('camno');
	var gigs = parseInt(document.getElementById('gigs').value);
	var days = parseInt(document.getElementById('days').value);
	var cnt = 0;
	var counter = 0;
	var bwcnt = 0;
	for (i in res){
		if (res[i].innerHTML){
			if (chk[i].checked){
				var num = parseInt(d.getElementsByClassName("qty")[i].value);
				cnt += res[i].value; 
				bwcnt += bwres[i].value; 
				counter += num;
			}
		}
	}
	
	camno.innerHTML = counter;
	
	var r = 0;
	if (cnt) {var r = gigs/cnt;}
	
	tstr.innerHTML = cnt.toFixed(2)+" GB/day";
	tbw.innerHTML = showkb(bwcnt);
	
	cnt = cnt*days;
	sp.innerHTML = cnt.toFixed(2)+" GB or " + (cnt/1024).toFixed(3)+" TB";
	dh.innerHTML = parseInt(r).toFixed(0) + " Days and " + ((r-parseInt(r))*24).toFixed(2) + " Hours";
}

function readBlob() {
	var files = document.getElementById('files').files;
	
	var file = files[0];
	var start = 0;
	var stop = file.size -1;
	
	var reader = new FileReader();
	
	reader.onloadend = function(evt) {
		if (evt.target.readyState == FileReader.DONE) {
			try {
				parsed = JSON.parse(evt.target.result);
			} catch (err) {
				window.alert("Invalid Database File!");
			}
			$("#cameratype").html("<p><h3>Camera Model: "+parsed["support_model"][0]+"</h3>");
			//$("#byte_content").text(evt.target.result);
		}
	};
	
	var blob = file.slice(start, stop+1);
	reader.readAsText(blob);
}

function deleteAll() {
	var d = document.getElementById('debug');
	while (d.firstChild){
		d.removeChild(d.firstChild);
	}
	updateBW();
}

function changeOutSel(){
	var master = this.parentNode;
	master = master.parentNode;
	
	// get attributes
	var mode = master.getElementsByClassName("outmode")[0];
	var imgno = master.getElementsByClassName("imageno")[0];
	
	// process image number
	while (imgno.firstChild) {
	    imgno.removeChild(imgno.firstChild);
	}
	for (var i in parsed["db"]["modes"]){
		var tmp = parsed["db"]["modes"][i];
		if (tmp["mode"] == mode.options[mode.selectedIndex].value){
			for (var j in tmp["image"]){
				var tmp2 = tmp["image"][j];
				var opt = document.createElement("option");
				opt.setAttribute("value", tmp2["id"]);
				var txt = document.createTextNode(tmp2["id"]);
				opt.appendChild(txt);
				imgno.appendChild(opt);
			}
		}
	}
}

function changeImgSel(){
	// called whenever ImgSel has changed;
	var master = this.parentNode;
	master = master.parentNode;
	
	var mode = master.getElementsByClassName("outmode")[0];
	var imgno = master.getElementsByClassName("imageno")[0];
	var ar = master.getElementsByClassName("ar")[0];
	var codec = master.getElementsByClassName("codec")[0];
	var resolution = master.getElementsByClassName("resolution")[0];
	var bitrate = master.getElementsByClassName("bitrate")[0];
	var frate = master.getElementsByClassName("frate")[0];
	
	while (ar.firstChild) {
	    ar.removeChild(ar.firstChild);
	}
	while (codec.firstChild) {
	    codec.removeChild(codec.firstChild);
	}
	while (resolution.firstChild) {
	    resolution.removeChild(resolution.firstChild);
	}
	while (bitrate.firstChild) {
	    bitrate.removeChild(bitrate.firstChild);
	}
	while (frate.firstChild) {
	    frate.removeChild(frate.firstChild);
	}
	
	for (var i in parsed["db"]["modes"]){
		var tmp = parsed["db"]["modes"][i];
		if (tmp["mode"] == mode.options[mode.selectedIndex].value){
			for (var j in tmp["image"]){
				if (tmp["image"][j]["id"] == imgno.options[imgno.selectedIndex].value){
					var tmp2 = tmp["image"][j]["ar"];
					for (var k in tmp2) {
						var opt = document.createElement("option");
						opt.setAttribute("value", tmp2[k]);
						var txt = document.createTextNode(tmp2[k]);
						opt.appendChild(txt);
						ar.appendChild(opt);
					}
					tmp2 = tmp["image"][j][ar.options[ar.selectedIndex].value];
					var opt = document.createElement("option");
					opt.setAttribute("value", tmp2["codec"]);
					var txt = document.createTextNode(tmp2["codec"]);
					opt.appendChild(txt);
					codec.appendChild(opt);
					
					var tmp3 = parsed["db"]["available_bitrate"];
					for (var l in tmp3){
						if (tmp2["bmin"] <= tmp3[l] && tmp2["bmax"] >= tmp3[l]) {
							var opt = document.createElement("option");
							opt.setAttribute("value", tmp3[l]);
							var txt = document.createTextNode(tmp3[l] + " Kbps");
							opt.appendChild(txt);
							bitrate.appendChild(opt);
						}
					}
					
					if (tmp2["bit_opt"]) {
						for (var l in tmp2["bit_opt"]){
							var opt = document.createElement("option");
							var key = Object.keys(tmp2["bit_opt"][l])[0];
							var evid_br = key*1024*1024*8/1000;
							opt.setAttribute("value", evid_br);
							var txt = document.createTextNode(tmp2["bit_opt"][l][key]);
							opt.appendChild(txt);
							bitrate.appendChild(opt);
						}
					}
					
					
					var tmp4 = tmp2["frate"][vmode];
					for (var m in tmp4){
						var opt = document.createElement("option");
						opt.setAttribute("value", tmp4[m]);
						var txt = document.createTextNode(tmp4[m]);
						opt.appendChild(txt);
						frate.appendChild(opt);
					}
				}
			}
		}
	}
	
}

function changeAR(){
	var master = this.parentNode;
	master = master.parentNode;
	
	var mode = master.getElementsByClassName("outmode")[0];
	var imgno = master.getElementsByClassName("imageno")[0];
	var ar = master.getElementsByClassName("ar")[0];
	var resolution = master.getElementsByClassName("resolution")[0];
	while (resolution.firstChild) {
	    resolution.removeChild(resolution.firstChild);
	}
	
	for (var i in parsed["db"]["modes"]){
		var tmp = parsed["db"]["modes"][i];
		if (tmp["mode"] == mode.options[mode.selectedIndex].value){
			for (var j in tmp["image"]){
				if (tmp["image"][j]["id"] == imgno.options[imgno.selectedIndex].value){
					var tmp2 = tmp["image"][j][ar.options[ar.selectedIndex].value];
					for (var k in tmp2["res"]){
						var opt = document.createElement("option");
						opt.setAttribute("value", tmp2["res"][k]);
						var txt = document.createTextNode(tmp2["res"][k]);
						opt.appendChild(txt);
						resolution.appendChild(opt);
					}
				}
			}
		}
	}
	
}

function changeBW(){
	var master = this.parentNode;
	master = master.parentNode;
	
	var bitrate = master.getElementsByClassName("bitrate")[0];
	var mode = master.getElementsByClassName("outmode")[0];
	var imgno = master.getElementsByClassName("imageno")[0];
	var audio = master.getElementsByClassName("audio")[0];
	var bw = master.getElementsByClassName("bandwidth")[0];
	var storage = master.getElementsByClassName("storage")[0];
	var act = master.getElementsByClassName("act")[0];
	var oh = master.getElementsByClassName("oh")[0];
	var frate = master.getElementsByClassName("frate")[0];
	
	var mult = parseInt(master.getElementsByClassName("qty")[0].value);
	
	var band = mult*(parseInt(bitrate.options[bitrate.selectedIndex].value)+parseInt(audio.options[audio.selectedIndex].value));
	
	if (mode.options[mode.selectedIndex].value == "Evidence Shot" && imgno.options[imgno.selectedIndex].value == "1") {
		band = band * frate.options[frate.selectedIndex].value;
	}
	
	bw.value = band;
	
	bw.innerHTML = showkb(band);
	
	var stor = calcstr(band, parseInt(oh.options[oh.selectedIndex].value), parseInt(act.options[act.selectedIndex].value));
	
	storage.value = stor;
	if (stor > 1024){
		storage.innerHTML = (stor/1024).toFixed(2)+"TB/day";
	} else {
		storage.innerHTML = stor.toFixed(2)+"GB/day";
	}
	updateBW();
}

function createDropdown(option) {
	var result = document.createElement("SELECT");
	var opt = document.createElement("option");
	var txt = document.createTextNode("--Choose Output Mode--");
	opt.appendChild(txt);
	result.setAttribute("class", "outmode");
	result.addEventListener("change", changeOutSel);
	result.addEventListener("change", changeImgSel);
	result.addEventListener("change", changeAR);
	result.addEventListener("change", changeBW);
	result.appendChild(opt);
	for (var j = 0; j < parsed["db"]["modes"].length; j++) {
		opt = document.createElement("option");
		opt.setAttribute("value", parsed["db"]["modes"][j]["mode"]);
		txt = document.createTextNode(parsed["db"]["modes"][j]["mode"]);
		opt.appendChild(txt);
		result.appendChild(opt);
	}
	
	return result;
}

function createLine() {
	var x = document.createElement("DIV");
	x.setAttribute("id", "select_div" + i.toString());
	i = i + 1;
	x.setAttribute("class", "line");
	x.innerHTML = "Camera Configuration: &nbsp;&nbsp;&nbsp; ";
	
	var btn = document.createElement("Button");
	var btntext = document.createTextNode("Remove");
	btn.appendChild(btntext);
	btn.addEventListener("click", function(){
		var master = this.parentNode;
		var grandmaster = master.parentNode;
		grandmaster.removeChild(master);
		updateBW();
	});
	x.appendChild(btn);
	
	var tbl = document.createElement("TABLE");
	tbl.setAttribute("align","center");
	tbl.border = "1";
	tbl.style.width  = '450px';
	tbl.style.border = '1px solid black';
	var tblbody = document.createElement("TBODY");
	
	var row = document.createElement("tr");
	row.innerHTML = "<th>Enable</th><th>Output Mode</th><th>Qty</th><th>Image No.</th><th>Aspect Ratio</th><th>Codec</th><th>Image Resolution</th><th>Bit Rate(Quality)</th><th>Frame Rate</th><th>Audio</th><th>Operation Hours</th><th>Activity</th><th>Bandwidth Req</th><th>Storage Req</th>"
	tblbody.appendChild(row);
	
	row = document.createElement("tr");
	
	var cell = document.createElement("td");
	
	var checkbox = document.createElement('input');
	checkbox.setAttribute("class", "checkbox");
	checkbox.type = "checkbox";
	checkbox.checked = true;
	checkbox.addEventListener("change", updateBW);
	
	cell.appendChild(checkbox);
	
	row.appendChild(cell);
	
	cell = document.createElement("td");
	cell.appendChild(createDropdown("config"));
	row.appendChild(cell);
	
	cell = document.createElement("td");
	var ifield = document.createElement('input');
	ifield.setAttribute("class", "qty");
	ifield.type = "text";
	ifield.setAttribute("maxlength", "3");
	ifield.setAttribute("size", 4);
	ifield.value = "1";
	ifield.addEventListener("change", changeBW);
	cell.appendChild(ifield);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	var sel = document.createElement('SELECT');
	sel.setAttribute("class", "imageno");
	sel.addEventListener("change", changeImgSel);
	sel.addEventListener("change", changeAR);
	sel.addEventListener("change", changeBW);
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	var sel = document.createElement('SELECT');
	sel.setAttribute("class", "ar");
	sel.addEventListener("change", changeAR);
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	sel = document.createElement('SELECT');
	sel.setAttribute("class", "codec");
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	sel = document.createElement('SELECT');
	sel.setAttribute("class", "resolution");
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	sel = document.createElement('SELECT');
	sel.setAttribute("class", "bitrate");
	sel.addEventListener("change", changeBW);
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	sel = document.createElement('SELECT');
	sel.setAttribute("class", "frate");
	sel.addEventListener("change", changeBW);
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	sel = document.createElement('SELECT');
	sel.setAttribute("class", "audio");
	sel.addEventListener("change", changeBW);
	
	var opt = document.createElement("option");
	opt.setAttribute("value", 0);
	var txt = document.createTextNode("Off");
	opt.appendChild(txt);
	sel.appendChild(opt);
	
	var opt = document.createElement("option");
	opt.setAttribute("value", 64);
	var txt = document.createTextNode("G.711(64kbps)");
	opt.appendChild(txt);
	sel.appendChild(opt);
	
	var opt = document.createElement("option");
	opt.setAttribute("value", 40);
	var txt = document.createTextNode("G.726(40kbps)");
	opt.appendChild(txt);
	sel.appendChild(opt);
	
	var opt = document.createElement("option");
	opt.setAttribute("value", 32);
	var txt = document.createTextNode("G.726(32kbps)");
	opt.appendChild(txt);
	sel.appendChild(opt);
	
	var opt = document.createElement("option");
	opt.setAttribute("value", 24);
	var txt = document.createTextNode("G.726(24kbps)");
	opt.appendChild(txt);
	sel.appendChild(opt);
	
	var opt = document.createElement("option");
	opt.setAttribute("value", 16);
	var txt = document.createTextNode("G.726(16kbps)");
	opt.appendChild(txt);
	sel.appendChild(opt);
	
	var opt = document.createElement("option");
	opt.setAttribute("value", 64);
	var txt = document.createTextNode("AAC(64kbps)");
	opt.appendChild(txt);
	sel.appendChild(opt);
	
	var opt = document.createElement("option");
	opt.setAttribute("value", 128);
	var txt = document.createTextNode("AAC(128kbps)");
	opt.appendChild(txt);
	sel.appendChild(opt);
	
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	sel = document.createElement('SELECT');
	sel.setAttribute("class", "oh");
	sel.addEventListener("change", changeBW);
	
	var ihtml = "";
	for (var p = 24; p >= 1; p=p-1){
		ihtml += "<option value="+p.toString()+">"+p.toString()+"</option>";
	}
	
	sel.innerHTML = ihtml;
	
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	sel = document.createElement('SELECT');
	sel.setAttribute("class", "act");
	sel.addEventListener("change", changeBW);
	
	var ihtml = "";
	for (var p = 100; p >= 10; p=p-10){
		ihtml += "<option value="+p.toString()+">"+p.toString()+"</option>";
	}
	
	sel.innerHTML = ihtml;
	
	cell.appendChild(sel);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	d = document.createElement("span");
	d.setAttribute("class", "bandwidth");
	cell.appendChild(d);
	row.appendChild(cell);
	
	cell = document.createElement("td");
	d = document.createElement("span");
	d.setAttribute("class", "storage");
	cell.appendChild(d);
	row.appendChild(cell);
	
	var button = document.createElement("Button");
	var textForButton = document.createTextNode("Random Button.");
	button.appendChild(textForButton);
	button.addEventListener("click", function(){
		window.alert("you clicked me");
	});
	button.addEventListener("click", changeImgSel);
	
	//cell = document.createElement("td");
	//cell.appendChild(button);
	//row.appendChild(cell);
	
	tblbody.appendChild(row);
	tbl.appendChild(tblbody);
	x.appendChild(tbl);
	
	document.getElementById('debug').appendChild(x);
}

$(document).ready(function(){
	$("#read").bind("click", readBlob);
	$("#add").bind("click", createLine);
	$("#clear").bind("click", deleteAll);
	$("#summary").hide();
	$("#masterdebug").hide();
	$("#help").hide();
	$("#func").hide();
	$("#byte_content").hide();
	$("#read").bind("click", function() {
		$("#summary").show(300);
		$("#masterdebug").show(300, createLine);
		$("#fileinput").hide(300);
		$("#func").show(300);
	});
	$("#updatebw").bind("click", updateBW);
	$("#vmode").on("change", function() {
		vmode = $("#vmode").find("option:selected").text();
		updateFR();
	});
	$("#sjk").click(function(){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "sjk.js";
		document.getElementsByTagName("head")[0].appendChild(script);
		$("#summary").show(300);
		$("#masterdebug").show(300, createLine);
		$("#fileinput").hide(300);
		$("#func").show(300);
	});
	$("#tyo").click(function(){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "tyo.js";
		document.getElementsByTagName("head")[0].appendChild(script);
		$("#summary").show(300);
		$("#masterdebug").show(300, createLine);
		$("#fileinput").hide(300);
		$("#func").show(300);
	})
	$("#print").click(function(){
		printable();
	});
	$("#hide").click(function(){
		$("#help").hide(300);
	});
	$("#show").click(function(){
		$("#help").show(300);
	});
	updateBW();
});