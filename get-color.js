/**
 * @Description 取主色工具
 * @author itorr<https://github.com/itorr>
 * @Date 2018-11-01
 */

var
IColors=(function(){

	var
	r2hax=function(num){
		num = num.toString(16);
		return num.length === 2?num:('0'+num)
	},
	rgb2hax=function(arr){
		return arr.map(r2hax).join('');
	},
	rgb2hsl=function(rgb){
		var
		r=rgb[0],
		g=rgb[1],
		b=rgb[2];

		r /= 255, g /= 255, b /= 255;
		var
		max = Math.max(r, g, b),
		min = Math.min(r, g, b);

		var
		h,
		s,
		l = (max + min) / 2;

		if(max == min){
			h = s = 0; // achromatic
		}else{
			var
			d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
			//h *= 60;
		}

		return [h, s, l];
	},
	hsl2rgb=function(hsl) {
		// const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue);
		var h = hsl[0]/hmax;// / 360;
		var s = hsl[1]/smax;// / 100;
		var l = hsl[2]/lmax;// / 100;
		// console.log(h,s,l);
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		var r, g, b;
		if (s == 0) {
			r = g = b = l;
		} else {
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		return [
			Math.round(r*255),
			Math.round(g*255),
			Math.round(b*255)
		]
		// return `rgb(${r * 255},${g * 255},${b * 255})`;
	};

	var
	hmax=24,
	smax=6,
	lmax=6,
	hslStr2hsl=function(str){

		// console.log(/----------/)
		// console.log(str)
		var
		hsl=str.split(',');

		hsl[0]=(+hsl[0])// /hmax)
		hsl[1]=(+hsl[1])// /smax)
		hsl[2]=(+hsl[2])// /lmax)

		// console.log(hsl)
		return hsl
	},
	hsl2hslStr=function(hsl){
		var
		h,s,l;


		h=Math.round(hsl[0]*hmax)
		s=Math.round(hsl[1]*smax)
		l=Math.round(hsl[2]*lmax)


		if(l==lmax){
			h=0
			s=0
		}
		return [
			h,
			s,
			l
		].join(',')
	},
	briefHsl2hsl=function(hsl){
		hsl[0]=Math.round(hsl[0]/hmax*360)
		hsl[1]=Math.round(hsl[1]/smax*100)
		hsl[2]=Math.round(hsl[2]/lmax*100)

		return hsl
	},
	celcHSimilar=function(a,b,all){
		var
		s=Math.abs(a-b),
		l=all-s;

		// console.log(a,b,all,Math.min(s,l));

		return Math.min(s,l);
	},
	solorSimilarDecide=function(A,B){
		// console.log(
		// 	Math.abs(A.hsl[0]-B.hsl[0]),
		// 	Math.abs(A.hsl[1]-B.hsl[1]),
		// 	Math.abs(A.hsl[2]-B.hsl[2]),
		// )
		var
		hi,
		si,
		li;


		hi=celcHSimilar(A.hsl[0],B.hsl[0],hmax);

		si=Math.abs(A.hsl[1]-B.hsl[1]);
		li=Math.abs(A.hsl[2]-B.hsl[2]);

		// hi<0.4
		// si<0.4
		// li<0.4

		//亮度几乎纯黑的情况
		if(A.hsl[2]<2 && li<2){
			return true;
		}


		//鲜艳度几乎没有的情况
		if(A.hsl[1]<2 && si<2 && li<2){
			return true;
		}



		// if(si<3 && li<2 && A.hsl[2]<2){
		// 	return true;
		// }

		return (
			hi<5
			&&
			si<3
			&&
			li<2
		)
	},
	mergeColorSimilar=function(colors){
		var
		i=1,
		ii=0;

		for(;i<colors.length;i++){

			for(ii=0;ii<i;ii++){
				if(solorSimilarDecide(colors[i],colors[ii])){
					//合并的情况
					// console.log('合并了一组',colors[ii],colors[i]);

					colors[ii].value+=colors[i].value;

					colors.splice(i,1);
					i--;
				}else{

				}
			}
		}

		return colors;
	},
	hsls2rgbsSort=function(arr,length){
		var
		Colors=[];

		for(var key in arr){
			var
			hsl=hslStr2hsl(key);

			Colors.push({
				// hslStr:key,
				hsl:hsl,
				rgb:hsl2rgb(hsl),
				value:arr[key]
			});
		}
		// console.log(Colors);

		Colors=Colors.sort(function(A,B){
			return (B.value-A.value);//+(B.hsl[1]-A.hsl[1])/1
		})

		Colors=mergeColorSimilar(Colors);

		Colors=Colors.sort(function(A,B){
			return (B.value-A.value);//+(B.hsl[1]-A.hsl[1])/1
		})

		// Colors=Colors.filter(function(color){
		// 	return color.value>length/2000
		// })

		// console.log(Colors)

		if(Colors[0].hsl[2]==lmax || Colors[0].hsl[2]==0){
			// var
			// one=Colors[0];
			// Colors[0]=Colors[1];
			// Colors[1]=one;

			Colors.push(Colors.shift())
		}

		if(Colors[0].hsl[2]==lmax || Colors[0].hsl[2]==0){
			Colors.push(Colors.shift())
		}
		// console.log(Colors);

		return Colors;
	};

	var
	IColors=function(options){
		if(!options)
			options={};

		if(!options.space)
			options.space=200;

		this.options=options;

		this.canvas = document.createElement('canvas'),
		this.ctx = this.canvas.getContext('2d');

		this.canvas.style.cssText='image-rendering:pixelated;position:absolute;top:0;right:0;z-index:-1;visibility:hidden;';

		document.body.appendChild(this.canvas);

		// var
		// space=options.space||200,
		// width,
		// height,
		// naturalWidth  = dom.naturalWidth,
		// naturalHeight = dom.naturalHeight;

		// if(naturalWidth<naturalHeight){
		// 	width  = max*naturalWidth/naturalHeight;
		// 	height = max;
		// }else{
		// 	width  = max;
		// 	height = max*naturalHeight/naturalWidth;
		// }
		this.width=options.space;
		this.height=options.space;

		this.canvas.width  = this.width;
		this.canvas.height = this.height;

		this.pixelength=this.width*this.height;
	};



	IColors.prototype.getColors=function(dom,options){

		if(!dom.complete){
			console.log('图片没有加载完成',dom);
			return [];
		}

		if(!options)
			options={};

		this.ctx.drawImage(dom, 0, 0, this.width, this.height);

		var
		imageData=this.ctx.getImageData(0, 0, this.width, this.height);

		// console.log(imageData.data);

		var
		r,g,b,a,
		hsl,
		h,s,l,
		hs,ss,ls,
		hslColors={},
		hslStr;

		var
		i=0,length=this.pixelength*4;//imageData.length;

		// console.log(i,length);

		for(;i<length;i+=4){

			// console.log(i,l);

			r=imageData.data[i+0]
			g=imageData.data[i+1]
			b=imageData.data[i+2]
			// a=imageData.data[i+3]


			//按照 HSL 压缩空间并整理颜色
			hsl=rgb2hsl([r,g,b])

			hslStr=hsl2hslStr(hsl)




			if(!hslColors[hslStr]){
				hslColors[hslStr]=1;
			}else{
				hslColors[hslStr]++;
			}

			// hs.push(Math.round(h*12))
			// ss.push(Math.round(s*6))
			// ls.push(Math.round(l*6))
		}

		// console.log(hslColors);

		var
		rgbColors=hsls2rgbsSort(hslColors,length)


		if(!options.limit)
			options.limit=6;


		return rgbColors.slice(0,options.limit).map(function(o){
			o.hax=rgb2hax(o.rgb)
			o.hsl=briefHsl2hsl(o.hsl)
			return o;
		});
		// console.log();
	};

	IColors.prototype.getColor=function(dom,options){
		// console.log(this);
		return this.getColors(dom,options)[0];
	};

	return IColors;

})();
