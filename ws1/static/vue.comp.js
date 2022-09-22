const dashboard = Vue.component('dashboard', {
    template: `
    <div>
	<div class="container">

	 	<div class="row">
			<div style="background-color:	#797ef6; background-image: linear-gradient(to right, #2b65ec, #ebfcff); padding: 15px ">  
				<a class="logout" href="/logout" role="button"><h3><i class="bi bi-box-arrow-right"></i></h3></a>
				<h5 style="float:right; margin-top:20px; margin-right:20px; margin-left:20px" > <i class="bi bi-person-circle"></i> {{ email }}      </h5> 
				<a style= "cursor:pointer;float:right; margin-top:20px; margin-right:20px; margin-left:20px" class="link-success" data-toggle="tooltip" data-placement="left" title="Export" @click="expall" ><h5 ><i class="bi bi-file-earmark-spreadsheet"></i></h5></a>
				<a style= "cursor:pointer;float:right; margin-top:20px; margin-right:20px; margin-left:20px" class="link-primary" data-toggle="tooltip" data-placement="left" title="Settings" @click="settings" ><h5 ><i class="bi bi-gear"></i></h5></a>
				<h2 class="display-5"> <i class="bi bi-house-door"></i> Dashboard  </h2> 
			</div>
		</div>
	
	 	<div class="row">
	 		<div class="col-4"><div class="p-4">
			 <h1 class="display-6"> Tracker</h1>
	    	</div></div>
	    	<div class="col-4"><div class="p-4">
			<h1 class="display-6"> Last Tracked</h1>
	    	</div></div>
	    </div>
		

	    <div v-for=" t in record">
		<div style= "background-color: #ebfcff; border-radius: 15px">
	    	<div class="row">
			
	    		<div class="col-4"><div class="p-3">
	    			{{ t["name"] }}
	    		</div></div>

	    		<div class="col-4"><div class="p-3">
	    			{{ t["last_update"] }}
	    		</div> </div>

	    		<div class="col-2"><div class="p-3">
	    			
					<a style= "cursor:pointer" class="link-info" @click="add_log(t.id, t.ttype, t.options)">  <h3 ><i class="bi bi-plus-square"></i></h3></a>
	    		</div></div>

	    		<div class="col-2"><div class="p-3">
					<div class="btn-group">
						<button type="button" class="btn btn-info" @click="view_track(t.id,t.ttype,t.desc, t.name, t.options)">View</button>
						<button type="button" class="btn btn-info dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				  			
						</button>
						<div class="dropdown-menu">
						  <a class="dropdown-item" @click="edit_track(t.id, t.ttype, t.desc, t.name, t.options)">Edit</a>
						  <a class="dropdown-item" @click="delete_track(t.id)">Delete</a>
						  <div class="dropdown-divider"></div>
						  <a class="dropdown-item" @click="explogs(t.id)">Export</a>
						</div>
					</div>
	    		</div></div>
				</div>
	    	</div>
			<br>
	    </div>


	    	<div class="row justify-content-center">
	    	<div class="col-6"><div class="p-5">
	    	<center><button class="btn btn-info btn-lg" @click="add_track" ><h4>ADD Tracker</h4></button></center>
	    	</div>	</div> 
	    	</div>
	 </div>

    </div>
    `,
	data: function() {
        return {
            uid: undefined,
            record: undefined,
			email: undefined
		}
        },
	methods: {
			edit_track: function(tid, ttype, desc,name,opts){
				console.log("edit");
				this.$router.push({ name: 'edittracker', params: { 'tid': tid,'tttype': ttype, 'tdesc': desc, 'tname': name,'toptions': opts}})

			},
			delete_track: function(tid){
				console.log("delete");
				/*edited*/
				fetch('http://127.0.0.1:5000/api/tracker/delete/'+tid, {
					method: "DELETE",
					headers: { 'Content-Type': 'application/json', 'Authentication-Token': sessionStorage.getItem('auth_token')}
				})
				.then(resp => resp.json())
				.then(data => console.log(data));
				var i = 0;
				while (i < this.record.length) {
				if (this.record[i].id == tid) {
					this.record.splice(i, 1);
				} else {
					++i;
				}
				}

			},

			view_track: function(tid,ttype,desc, tname, opts){
				console.log(tname);
				console.log(opts);
				console.log(desc);
				let ct ="";
				if( ttype == 1){
					ct = "bar"
				}
				if( ttype == 2){
					ct = "pie"
				}
				if( ttype == 3) {
					ct = "bar"
				}
				try {
					let optarr= opts.split(",")
				
				this.$router.push({ name: 'viewtracker', params: { 'tname': tname, 'tid': tid, 'ttype': ct, 'topts': opts, 'tdesc':desc}})
				} catch (error) {
					this.$router.push({ name: 'viewtracker',params: { 'tname': tname, 'tid': tid, 'ttype': ct, 'tdesc':desc}})
				}
			},
			add_track: function(){
				this.$router.push({ name: 'newtracker', params: { 'uid': this.uid}})
			},
			add_log: function(tid, type, opts){
				try {
					let optarr= opts.split(",")
				
				this.$router.push({ name: 'newlog', params: { 'tid': tid, 'ttype': type, 'options': optarr}})
				} catch (error) {
					this.$router.push({ name: 'newlog', params: { 'tid': tid, 'ttype': type}})
				}
				
			},
			expall: function(){
				fetch('http://127.0.0.1:5000/expall', {
					method: "GET",
					headers: { 'Content-Type': 'application/json'}
				})
				.then(resp => resp.json())
				.then(data => console.log(data));
			},
			explogs: function(tid){
				fetch('http://127.0.0.1:5000/exptracker/'+tid, {
					method: "GET",
					headers: { 'Content-Type': 'application/json'}
				})
				.then(resp => resp.json())
				.then(data => console.log(data));
			},
			settings: function(){
				this.$router.push({name: 'settings'})
			}
		},

    created: function(){

		/*edited*/ 
	fetch('http://127.0.0.1:5000/api/user', {headers: { 'Content-Type': 'application/json', 'Authentication-Token': sessionStorage.getItem('auth_token')}})
	.then(resp => resp.json())
	.then(data => {
		this.uid = data.uid;
		this.email = data.email;
		return fetch('http://127.0.0.1:5000/api/tracker/'+this.uid, {headers: { 'Content-Type': 'application/json', 'Authentication-Token': sessionStorage.getItem('auth_token')}})
	})
    .then(resp => resp.json())
	.then(data => {
		this.record = data;
		console.log(data);
	})
	.catch(err => console.log(err.message))
    }
	
}

)


const newtracker= Vue.component('newtracker', {
	props: ['uid'],

	data: function(){
		return {
			name: undefined,
			ttype: undefined,
			desc: null,
			options: null,
			}
	},

	template: 
	`
	<div>
    <div class="container">
      <div class="row  h-100">
        <div style="background-color:	#797ef6; background-image: linear-gradient(to right, #2b65ec, #afdcec); padding: 15px ">  
          <h2 class="display-5">  <i class="bi bi-bookmark-star"></i> Add new Tracker  </h2> 
        </div>
      </div>

      <div class="row ">
        <div class="col text-black ">
          <div class=" d-flex justify-content-center h-80 px-5 ms-xl-4 mt-5 mb-5 pt-5 pt-xl-n5 mt-xl-n5">
            <div style="border-style: solid ; border-color: #6698ff; border-radius: 15px">
              <div style="width: 50rem; padding: 25px">
      

                <div class="form-outline  mb-5">
                  <label for= "name" class="form-label"> Tracker Name: </label>
                  <input type="text" class="form-control form-control-lg" v-model="name" id="name" required>
                </div>
                <div class="form-outline  mb-5">
                  <label for= "desc" class="form-label"> Description: </label>
                  <textarea class="form-control form-control-lg" v-model="desc" id="desc" rows="2" name="desc" placeholder="Write something..."></textarea>
                </div>
                <div class="form-outline  mb-5">
                  <label for= "selectinput" class="form-label"> Tracker type: </label>
                  <select id="selectinput"class="form-select" aria-label="Default select example" v-model="ttype" required>
                    <option selected hidden disabled value="">Select option</option>
                      <option value="1">Number</option>
                      <option value="2">Multiple Choice</option>
                      <option value="3">Time Duration</option>
                      </select>
                </div>
                <div class="form-outline mb-5">
                  <label for= "options" class="form-label"> Additional input(for multiple choice option): </label>
                  <input type="text" class="form-control form-control-lg" id="options" v-model="options" >
                </div>
                <div class="pt-1  ">
                  <button @click="send" class="btn btn-info btn-lg">Add</button>
				  <button @click="cancel" class="btn btn-outline-info btn-lg float-end">Cancel</button>
                </div>
              </div> 
            </div>
          </div> 
        </div>
      </div>
    </div>  
  </div>
	`,
	methods: {
		send: async function(){
			/*edited */
        await fetch('http://127.0.0.1:5000/api/tracker',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authentication-Token': sessionStorage.getItem('auth_token')
			},
			body: JSON.stringify({ 'name': this.name,'uid':this.uid, 'ttype':this.ttype, 'desc':this.desc, 'options':this.options })
		})
		.then(resp => resp.json())
		.then(data => console.log(data));
		this.$router.push({name: 'dashboard'})
		},
		cancel: function(){
			this.$router.push({name: 'dashboard'})
		}
	},
	
})


const newlog = Vue.component('newlog', {
	props: ['tid', 'ttype', 'options'],
	data: function(){
		return {
			value: undefined,
			time: undefined,
			notes: null,
			flag1: true,
			flag2: true,
			flag3: true
		}
	},

	template: 
	`
	<div>
    <div class="container">
      <div class="row  h-100">
        <div style="background-color:	#797ef6; background-image: linear-gradient(to right, #2b65ec, #ebfcff); padding: 15px ">  
          <h2 class="display-5"> <i class="bi bi-journal-plus"></i> Add new Log </h2> 
        </div>
      </div>

      <div class="row ">
        <div class="col text-black ">
          <div class=" d-flex justify-content-center h-80 px-5 ms-xl-4 mt-5 mb-5 pt-5 pt-xl-n5 mt-xl-n5">
            <div style="border-style: solid ; border-color: #797ef6; border-radius: 15px">
              <div style="width: 50rem; padding: 25px">
      

                <div class="form-outline  mb-5">
                  <label for= "time" class="form-label"> Timestamp </label>
                  <input type="datetime-local" class="form-control form-control-lg" v-model="time" id="time" required>
                </div>
                <div class="form-outline  mb-5">
                  <label for= "value" class="form-label"> Value: </label>
                  <input type="text" :class="{hideclass: flag1} " class="form-control form-control-lg" v-model="value" id="value1"  name="value1" >                
                  <select id="value2" :class="{hideclass: flag2} " class="form-select" aria-label="Default select example" v-model="value" required>
                    <option selected hidden disabled value="">Select option</option>
                    <option v-for="i in options"  >{{ i }}</option>
                  </select>
				  
                  <span style=" display:inline-flex" :class="{hideclass: flag3} " >
				  <input @change="tdf" onClick="this.select();" type="text"  class="form-control form-control-sm" id="value31"  name="value31" style="width: 50px; margin-left:5px; margin-right:5px" value="0"> Hours		<input @change="tdf" onClick="this.select();" type="text" class="form-control form-control-sm" id="value32"  name="value32" style="width: 50px; margin-left:15px; margin-right:5px" value="0"> 
				  </span> 
                </div>
                <div class="form-outline mb-5">
                  <label for= "npte_input" class="form-label"> Notes: </label>
                  <textarea  class="form-control form-control-lg" id="note_input" rows="2" placeholder="Write something..." v-model="notes" ></textarea>
                </div>
                <div class="pt-1  ">
                  <button @click="send" class="btn btn-primary btn-lg">Add</button>
				  <button @click="cancel" class="btn btn-outline-info btn-lg float-end">Cancel</button>
                </div>
              </div> 
            </div>
          </div> 
        </div>
      </div>
    </div>  
  </div>
	`,
	methods: {
		send: async function(){
			/**edited */
        await fetch('http://127.0.0.1:5000/api/log',{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authentication-Token': sessionStorage.getItem('auth_token')
			},
			body: JSON.stringify({ 'tid': this.tid, 'time': this.time,'value':this.value, 'notes':this.notes })
		})
		.then(resp => resp.json())
		.then(data => console.log(data));
		this.$router.push({name: 'dashboard'})

		},
		cancel: function(){
			this.$router.push({name: 'dashboard'})
		},
		tdf: function(){
			var hh = document.getElementById("value31").value;
			var mm = document.getElementById("value32").value;
			this.value = hh*60+ Number(mm);
			console.log(hh*60+mm);
		}
	},
	created: function(){
		var today = new Date();
		var yyyy = today.getFullYear();
		var mm= today.getMonth()+1;
		if (mm < 10){
			mm= '0'+ mm;
		}
		var dd= today.getDate();
		if (dd < 10){
			dd= '0'+ dd;
		}
		var hh = today.getHours() ;
		if (hh < 10){
			hh= '0'+ hh;
		}
		var mn = today.getMinutes();
		if (mn < 10){
			mn= '0'+ mn;
		}
		var dateTime = yyyy+'-'+mm+'-'+dd+'T'+hh+':'+mn;
		this.time= dateTime;
		if (this.ttype == 1){
			this.flag1 = false;
		}
		if (this.ttype == 2){
			this.flag2 =false;
		}
		if (this.ttype == 3){
			this.flag3 =false;
		}
	}

})

const edittracker= Vue.component('edittracker', {
	props: ['tid', 'tttype', 'tdesc', 'tname', 'toptions'],

	data: function(){
		return {
			name: undefined,
			ttype: undefined,
			desc: undefined,
			options: null,
			}
	},

	template: 
	`
	<div>
	<div class="container">
		<div class="row  h-100">
		  <div style="background-color:	#797ef6; background-image: linear-gradient(to right, #2b65ec, #afdcec); padding: 15px ">  
			<h2 class="display-5">  <i class="bi bi-pencil"></i> Edit Tracker  </h2> 
		  </div>
		</div>
  
		<div class="row ">
		  <div class="col text-black ">
			<div class=" d-flex justify-content-center h-80 px-5 ms-xl-4 mt-5 mb-5 pt-5 pt-xl-n5 mt-xl-n5">
			  <div style="border-style: solid ; border-color: #6698ff; border-radius: 15px">
				<div style="width: 50rem; padding: 25px">
		
  
				  <div class="form-outline  mb-5">
					<label for= "name" class="form-label"> Tracker Name: </label>
					<input type="text" class="form-control form-control-lg" v-model="name" id="name" required>
				  </div>
				  <div class="form-outline  mb-5">
					<label for= "desc" class="form-label"> Description: </label>
					<textarea class="form-control form-control-lg" v-model="desc" id="desc" rows="2" name="desc" placeholder="Write something..."></textarea>
				  </div>
				  <div class="form-outline  mb-5">
					<label for= "selectinput" class="form-label"> Tracker type: </label>
					<select id="selectinput"class="form-select" aria-label="Default select example" v-model="ttype" required>
					  <option selected hidden disabled value="">Select option</option>
						<option value="1">Number</option>
						<option value="2">Multiple Choice</option>
						<option value="3">Time Duration</option>
						</select>
				  </div>
				  <div class="form-outline mb-5">
					<label for= "options" class="form-label"> Additional input(for multiple choice option): </label>
					<input type="text" class="form-control form-control-lg" id="options" v-model="options" >
				  </div>
				  <div class="pt-1  ">
					<button @click="send" class="btn btn-info btn-lg">Add</button>
					<button @click="cancel" class="btn btn-outline-info btn-lg float-end">Cancel</button>
				  </div>
				</div> 
			  </div>
			</div> 
		  </div>
		</div>
	  </div>  
	</div>
	`,
	methods: {
		send: function(){
			/**edited */
        fetch('http://127.0.0.1:5000/api/tracker',{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authentication-Token': sessionStorage.getItem('auth_token')
			},
			body: JSON.stringify({ 'name': this.name,'tid':this.tid, 'ttype':this.ttype, 'desc':this.desc, 'options':this.options })
		})
		.then(resp => resp.json())
		.then(data => console.log(data));
		this.$router.push({name: 'dashboard'})

		},
		cancel: function(){
			this.$router.push({name: 'dashboard'})
		}
	},
	created: function(){
		this.name= this.tname;
		this.ttype= this.tttype;
		this.desc= this.tdesc;
		this.options= this.toptions
	}
	
})

const viewtracker = Vue.component('viewtracker', {
    template: `
    <div>
    <p align="right"><a class="btn btn-outline-primary btn-sm" href="/" role="button"><b>Logout</b></a></p>
	 <h1 class="display-3">Welcome log track </h1>   


	 <div class="container">

	 <div class="row">
	<center> <canvas id="myChart" width="750" height="500"></canvas> </center>
	 </div>
	 	<div class="row">
	 		<div class="col-3"><div class="p-4">
	    	  	<h2> TIMESTAMP</h2>
	    	</div></div>
	    	<div class="col-3"><div class="p-4">
	      		<h2> VALUE</h2>
	    	</div></div>
			<div class="col-3"><div class="p-4">
	      		<h2> Description </h2>
	    	</div></div>
		</div>
		<div v-for=" t in new_var">
	    	<div class="row">
	    		<div class="col-3"><div class="p-3">
	    			{{ t["time"] }}
	    		</div></div>

	    		<div class="col-3"><div class="p-3">
	    			{{ t["value"] }}
	    		</div> </div>

				<div class="col-3"><div class="p-3">
	    			{{ t["notes"] }}
	    		</div> </div>
				
				<div class="col-3"><div class="p-3">
				<div class="dropdown">
				<button class="btn btn-secondary dropdown-toggle" type="button" 		id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Options
				</button>
				<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
					<a class="dropdown-item" @click="edit_log(t.id, t.tid, t.value, t.notes, t.time)">Edit</a>
					<a class="dropdown-item" @click="delete_log(t.id)" >Delete</a>
				</div>
				</div>
				</div> </div>

	    	</div>
		</div>
	</div>

	 </div>

    </div>
    `,
	props: ['tname', 'ttype', 'topts', 'tid', 'tdesc'],
	data: function() {
        return {
            _tid: this.tid,
            record: undefined,
			_record: undefined,
			chart_type: "pie",
			cdate: undefined,
			cdata: undefined,
			new_var: undefined,
			opts: null,
			cdsec: undefined
		}
        },
	methods: {
			edit_log: function(lid, ltid, lvalue, lnotes, ltime){
				console.log("edit")
				let type_ = 0;
				if( this.ttype == "bar"){
					type_ = 1
				}
				if( this.ttype == "pie"){
					type_ = 2
				}
				if( this.ttype == "line") {
					type_ = 3
				}
				this.$router.push({ name: 'edit_log', params: { 'lid': lid, 'ltid': ltid, 'lvalue': lvalue, 'lnotes': lnotes, 'ltime':ltime, 'opts': this.opts, 'ttype': type_}})
			},
			delete_log: function(lid){
				//functional
				fetch('http://127.0.0.1:5000/api/log/delete/'+lid, {
					method: "DELETE",
					headers: { 'Content-Type': 'application/json', 'Authentication-Token': sessionStorage.getItem('auth_token')}
				})
				.then(resp => resp.json())
				.then(data => console.log(data));
				console.log("delete");
				var i = 0;
				while (i < this.new_var.length) {
				if (this.new_var[i].id == lid) {
					this.new_var.splice(i, 1);
					this.cdate.splice(i, 1);
					this.cdata.splice(i, 1);
					
					
				} else {
					++i;
				}
				}
				
				/*myChart.data.datasets[0].data = this.cdata;
    			myChart.data.labels = this.cdate;
				myChart.update()*/

			},
			parsedata (){
				if( this.topts != undefined){
					this.opts = this.topts;
				}
		
				console.log(this.record);	
		
				const temprecord = this.record.map(obj => {
					return {...obj, date: new Date(obj.time)};
				  });
				  
				  console.log(this._record);
				  //this._record =temprecord;
				  
				  // ✅ Sort in Ascending order (low to high)
				  const sortedAsc = temprecord.sort(
					(objA, objB) => Number(objA.date) - Number(objB.date),
				  );
				  this.cdate = sortedAsc.map(obj => {
					return  obj.time;
				  });
				 /* this.cdsec =this.cdate.map(t => {
					const d = new Date('2022-04-26T09:35:24');
					const ss = Math.floor(d.getTime() / 1000);
					return ss;
				  })*/
				  
				  this.cdata = sortedAsc.map(obj => {
					return  obj.value;
				  });
				  /////////////////////////
				  this.cdsec = sortedAsc.map(obj => {
					return { x: Math.floor(obj.date), y: obj.value}
				  })
				  /////////////////////
				  console.log(this.cdate);
				  console.log(this.cdata);
				  console.log(this.chart_type);
		
				 
		
				this.new_var= temprecord;
			},
			colorgen : function() {
				var r = Math.floor(Math.random() * 255);
				var g = Math.floor(Math.random() * 255);
				var b = Math.floor(Math.random() * 255);
				return "rgb(" + r + "," + g + "," + b + ")";
			 }

		},







	watch: { cdata(ndata){
			console.log("from watchted");
			console.log(ndata);
			console.log(this.cdate);
			let chartStatus = Chart.getChart("myChart"); // <canvas> id
			if (chartStatus != undefined) {
			chartStatus.destroy();
			}
			const ctx = document.getElementById("myChart");
			let mydata= {};
			let optn = {};




			if( this.ttype == "bar"){
		   mydata = {
			labels: this.cdate,
			datasets: [{
				//label: '# of Votes',
				//data: this.cdata,
				data: this.cdata,
				/////
				backgroundColor: [
					'rgba(255, 99 , 132, 0.5)',
					'rgba(54 , 162, 235, 0.5)',
					'rgba(255, 206, 86 , 0.5)',
					'rgba(75 , 192, 192, 0.5)',
					'rgba(153, 102, 255, 0.5)',
					'rgba(255, 159, 64 , 0.5)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1,
			}]
		};
		optn = {
			responsive: false,
			scales: {				
				//y: {
				
				x:{
						type: 'time',
						ticks: {
							major: {
								enabled: true
							}
						},
        				position: 'bottom',
						beginAtZero: true
					
				}
			}
		}	
	}
	if( this.ttype == "line"){
		mydata = {
		 //labels: this.cdate,
		 datasets: [{
			 //label: '# of Votes',
			 //data: this.cdata,
			 data: this.cdsec,
			 /////
			 backgroundColor: [
				 'rgba(255, 99 , 132, 0.5)',
				 'rgba(54 , 162, 235, 0.5)',
				 'rgba(255, 206, 86 , 0.5)',
				 'rgba(75 , 192, 192, 0.5)',
				 'rgba(153, 102, 255, 0.5)',
				 'rgba(255, 159, 64 , 0.5)'
			 ],
			 borderColor: [
				 
				 'rgba(54, 162, 235, 1)',
				 
			 ],
			 tension: 0.5
		 }]
	 };
	 optn = {
		 responsive: false,
		 scales: {				
			 //y: {
			 
			 x:{
					 type: 'time',
					 position: 'bottom',
					 beginAtZero: true
				 
			 }
		 }
	 }	
 }



if( this.ttype == "pie"){
	
	let  weight = {};
	let oparr =this.topts.split(",");
	var colarr = [];
	countarr=[]
	for (const i of this.cdata) {
	  if (weight[i]) {
		weight[i] += 1;
	  } else {
		weight[i] = 1;
	  }
	}
	for (const i of oparr){
		if(weight[i]){
			countarr.push(weight[i]);
			colarr.push(this.colorgen());
		}
		else{
			countarr.push(0);
		}
	}
	

         ;

	console.log(countarr);
	mydata = {
			labels: oparr,
			  datasets: [{
				label: 'My First Dataset',
				data: countarr,
				backgroundColor: [
					'rgba(255, 99 , 132, 0.75)',
					'rgba(54 , 162, 235, 0.75)',
					'rgba(255, 206, 86 , 0.75)',
					'rgba(75 , 192, 192, 0.75)',
					'rgba(153, 102, 255, 0.75)',
					'rgba(255, 159, 64 , 0.75)'
				],
				borderRadius: 2,
				hoverOffset: 4
			  }]
			};
			optn = {
				responsive: false}
			};




			try {
				const myChart = new Chart(ctx, {
					type: this.ttype,
					data: mydata,
					options: optn
				});
				console.log("chart_ready")
			} catch (error) {
				console.log(error)
			}
			
	}
},
    created: async function(){
		/**edited */
	await fetch('http://127.0.0.1:5000/api/log/'+this.tid, {headers: { 'Content-Type': 'application/json', 'Authentication-Token': sessionStorage.getItem('auth_token')}})
	.then(resp => resp.json())
	.then(data => this.record = data)
	.catch(err => console.log(err.message));

	 this.parsedata();
	


		
	}
}

)
 //console.log(this._record);
		/*  
		const ctx = document.getElementById('myChart');
		const myChart = new Chart(ctx, {
			type: this.ttype,

			data: {
				labels: this.cdate,
				datasets: [{
					label: '# of Votes',
					data: this.cdata,
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}]
			},
			options: {
				responsive: false,
				scales: {
					
					y: {
						beginAtZero: true
					}
				}
			}
		});
	*/



////////////////////////////////////////////////////////






const edit_log = Vue.component('edit_log', {
	props: ['lid', 'ltid', 'lvalue', 'lnotes' ,'ltime' , 'opts', 'ttype'],
	data: function(){
		return {
			value: undefined,
			time: undefined,
			notes: null,
			flag1: true,
			flag2: true,
			flag3: true,
			options: undefined
		}
	},

	template: 
	`
	<div>
		<div class="container">
		  <div class="row  h-100">
			<div style="background-color:	#797ef6; background-image: linear-gradient(to right, #2b65ec, #ebfcff); padding: 15px ">  
			  <h2 class="display-5"> <i class="bi bi-pencil"></i> Edit Log </h2> 
			</div>
		  </div>
	
		  <div class="row ">
			<div class="col text-black ">
			  <div class=" d-flex justify-content-center h-80 px-5 ms-xl-4 mt-5 mb-5 pt-5 pt-xl-n5 mt-xl-n5">
				<div style="border-style: solid ; border-color: #797ef6; border-radius: 15px">
				  <div style="width: 50rem; padding: 25px">
		  
	
					<div class="form-outline  mb-5">
					  <label for= "time" class="form-label"> Timestamp </label>
					  <input type="datetime-local" class="form-control form-control-lg" v-model="time" id="time" required>
					</div>
					<div class="form-outline  mb-5">
					  <label for= "value" class="form-label"> Value: </label>
					  <input type="text" :class="{hideclass: flag1} " class="form-control form-control-lg" v-model="value" id="value1"  name="value1" >                
					  <select id="value2" :class="{hideclass: flag2} " class="form-select" aria-label="Default select example" v-model="value" required>
						<option selected hidden disabled value="">Select option</option>
						<option v-for="i in options"  >{{ i }}</option>
					  </select>
					</div>
					<div class="form-outline mb-5">
					  <label for= "npte_input" class="form-label"> Notes: </label>
					  <textarea  class="form-control form-control-lg" id="note_input" rows="2" placeholder="Write something..." v-model="notes" ></textarea>
					</div>
					<div class="pt-1  ">
					  <button @click="send" class="btn btn-primary btn-lg">Add</button>
					  <button @click="cancel" class="btn btn-outline-info btn-lg float-end">Cancel</button>
					</div>
				  </div> 
				</div>
			  </div> 
			</div>
		  </div>
		</div>  
	  </div>
	`,
	methods: {
		send: async function(){
			/**edited */
        await fetch('http://127.0.0.1:5000/api/log',{
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				'Authentication-Token': sessionStorage.getItem('auth_token')
			},
			body: JSON.stringify({ 'lid': this.lid, 'time': this.time,'value':this.value, 'notes':this.notes })
		})
		.then(resp => resp.json())
		.then(data => console.log(data));
		this.$router.push({name: 'dashboard'})

		},
		cancel: function(){
			this.$router.push({name: 'dashboard'})
		}
	},
	created: function(){
		//PROBABLY USELESS
		/*var today = new Date();
		var yyyy = today.getFullYear();
		var mm= today.getMonth()+1;
		if (mm < 10){
			mm= '0'+ mm;
		}
		var dd= today.getDate();
		if (dd < 10){
			dd= '0'+ dd;
		}
		var hh = today.getHours() ;
		if (hh < 10){
			hh= '0'+ hh;
		}
		var mn = today.getMinutes();
		if (mn < 10){
			mn= '0'+ mn;
		}
		var dateTime = yyyy+'-'+mm+'-'+dd+'T'+hh+':'+mn;
		this.time= dateTime;
		*/
		if (this.ttype == 1){
			this.flag1 = false;
		}
		if (this.ttype == 2){
			this.flag2 =false;
		}
		if (this.ttype == 3){
			this.flag3 =false;
		}
		try {
			this.options = this.opts.split(",");
		} catch (error) {
			this.options= null;
		}
		
		console.log(this.ltime);
		this.time = this.ltime;
		this.value = this.lvalue;
		this.notes = this.lnotes;

	}
	
})

const settings= Vue.component('settings',{
	props: ['uid'],
	data: function(){
		return {
			whook: null,
			notifs: false,
		}
	},
	template:
	`
	<div>
	<div class="container">
            <div class="row  h-100">
              <div style="background-color:	#797ef6; background-image: linear-gradient(to right, #2b65ec, #ebfcff); padding: 15px ">  
                <h2 class="display-5"> <i class="bi bi-gear"></i> Settings </h2> 
              </div>
            </div>
                
            <div class="row h-100 ">
                <div class=" d-flex justify-content-center  px-5 ms-xl-4 mt-5 mb-5 pt-5 pt-xl-n5 mt-xl-n5">
                
                    <div class="col-6 align-self-center">
                        <div class="form-outline mb-5">
                            <label for="webhook" class="form-label"> Add webhook </label>
                            <input v-model="whook" id="webhook" type="text" class="form-control form-control-lg">
                        </div>  
                        <div class="pt-5 mt-5">
                            <button style @click="save" class="btn btn-primary btn-lg ">Save Changes</button>
                            <button @click="cancel" class="btn btn-outline-info btn-lg float-end">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                

	</div>
	`,
	methods: {
		save: function(){
				fetch('http://127.0.0.1:5000/api/settings',{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authentication-Token': sessionStorage.getItem('auth_token')
				},
				body: JSON.stringify({ 'whooks': this.whook })
			})
			.then(resp => resp.json())
			.then(data => console.log(data));
			this.$router.push({name: 'dashboard'})
		},
		cancel: function(){
			this.$router.push({name: 'dashboard'})
		}
	},

	created: function(){

	}
})






////////////////////////////////////////////////////////



const routes = [
	{
		path: '/',
		component: dashboard,
		name: 'dashboard'
	}, {
		path: '/new_tracker',
		component: newtracker,
		name: 'newtracker',
		props: true
	}, {
		path: '/new_log',
		component: newlog,
		name: 'newlog',
		props: true
	},{
		path: '/edit_tracker',
		component: edittracker,
		name: 'edittracker',
		props: true
	},{
		path: '/view_log',
		component: viewtracker,
		name: 'viewtracker',
		props: true
	},{
		path: '/edit_log',
		component: edit_log,
		name: 'edit_log',
		props: true
	},{
		path: '/settings',
		component: settings,
		name: 'settings',
		props: true
	}



]




const router = new VueRouter({
	routes
})

var app= new Vue({
	router: router,
    el: '#app'
})