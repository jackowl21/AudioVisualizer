precision mediump float;

varying vec4 fColor;
varying vec2 fTexCoord;

uniform sampler2D sampler2d;
uniform float Factor1;
uniform float Factor2;
uniform float Factor3;
uniform float Factor4;
uniform float Factor5;
uniform float Factor6;
uniform float Factor7;
uniform float Factor8;
uniform float Factor9;

float wave(float amplitude, float wavelength, float posY, float multiplier, float factor1, float factor2)
{
	
	return amplitude * factor1 * (cos(wavelength * gl_FragCoord.x + factor2 * multiplier)) + posY;
	
}

float wave2(float amplitude, float wavelength, float posX, float multiplier, float factor1, float factor2)
{
	return amplitude * factor1 * (cos(wavelength * gl_FragCoord.y + factor2 * multiplier )) + posX;
}
float waveSpecial(float amplitude, float wavelength, float posY, float multiplier, float factor1, float factor2, float factor3)
{
	return amplitude * factor1 * (cos(wavelength * gl_FragCoord.x + factor2 * multiplier)) + posY;
}

float circleCenter(float coordX, float coordY)
{
	return (((gl_FragCoord.x - coordX) * (gl_FragCoord.x - coordX)) +
		((gl_FragCoord.y - coordY) * (gl_FragCoord.y - coordY)));
}

float circleMove(float coordX, float coordY)
{
	return (gl_FragCoord.x - (coordX + sin(Factor6))) * (gl_FragCoord.x - (coordX + sin(Factor6))) +
		((gl_FragCoord.y - (coordY + sin(Factor6)))  * (gl_FragCoord.y - (coordX + sin(Factor6))));
}

float radius(float pos, float factor, float frequency)
{
	return pos + abs(factor * frequency);
}

float normalRadius()
{
	return abs(Factor1 * 100000.0);
}

float radiusDistance(vec2 curPos, float center)
{
	return sqrt((curPos.y - center) * (curPos.y - center) 
				+ (curPos.x - center) * (curPos.x- center)) ;
}

float rectDistance(vec2 curPos, float x, float y)
{
	return sqrt((curPos.y - y) * (curPos.y - y) 
				+ (curPos.x - x) * (curPos.x - x)) ;
}

bool isOver = false;

void main()                                 
{   
	vec4 texturePixel = texture2D(sampler2d, fTexCoord);
	
	vec4 resultColor;
	vec4 resultColor2;
	vec4 resultColor3;
	vec4 resultColor4;
	vec4 resultColor5;
	vec4 resultColor5b;
	vec4 resultColor6;
	vec4 resultColor7;
	vec4 resultColor7b;
	vec4 resultColor8;
	vec4 resultColor9;


	
	float amp = 500.0;
	float amp2 = 100.0;
	float windowHalfHeight = 200.0;
	float windowHalfWidth = 400.0;

	float lighthenedPointY = wave(amp * 0.001 * gl_FragCoord.x , 0.075, windowHalfHeight, 50.0, Factor3, Factor1);
	float lighthenedPointX = wave2(amp, 0.01, (windowHalfWidth + sin(Factor1) * 300.0), 50.0, Factor3, Factor1);
	float lighthenedPointX2 = wave2(amp, 0.01, (windowHalfWidth - 100.0 + sin(Factor1) * 300.0), 50.0, Factor3, Factor1);
	
	
	vec2 lighthenedPoint = vec2(gl_FragCoord.x, lighthenedPointY);
	vec2 lighthenedPoint2 = vec2(lighthenedPointX, gl_FragCoord.y);
	vec2 lighthenedPoint3 = vec2(lighthenedPointX2, gl_FragCoord.y);
	vec2 currentPixelPos = vec2(gl_FragCoord.x, gl_FragCoord.y);
	vec4 currentColor = vec4(texturePixel.r, texturePixel.g, texturePixel.b, texturePixel.a);
	

	float tempDist = abs(radius(100.0, Factor3 * 10.0, 2000.0)) - ((abs(radius(100.0, Factor3 * 10.0, 2000.0) - radius(90.0, Factor3 * 10.0, 1000.0)))/2.0); 
	
	
	float thickness = 10.0;
	float thickness2 = 10000.0 + abs(radius(100.0, Factor3 * 10.0, 2000.0) - radius(90.0, Factor3 * 100.0, 1000.0));
	float thickness3 = 500.0;
	float thickness4 = 800.0 + sin(Factor6 * 10000.0);
	float thickness5 = 100.0;
	float thickness6 = 40.0;
	float thicknessPixel = 50.0;
	

	float r; //r = mix(1.0, 0.5, dist/thickness);
	float g; //g = mix(1.0, 0.0, dist/thickness);
	float b; //b = mix(1.0, 0.7, dist/thickness);
	
	
	
	if(circleCenter(400.0, 300.0) < (50000.0 + radius(1500.0, Factor3 * 10.0, 10000.0)))
	{
		float dist = abs(currentPixelPos.y - lighthenedPoint.y);
		r = mix(1.0, 0.2, dist/thickness);
		if(r < 0.0)
		{
			r = 0.0;
		}

		g = mix(0.6, 0.1, dist/thickness);
		if(g < 0.0)
		{
			g = 0.0;
		}

		b = mix(1.0, 0.6, dist/thickness);
		if(b < 0.0)
		{
			b = 0.0;
		}
	
		texturePixel.r = (texturePixel.r + texturePixel.g + texturePixel.b) / (3.0 + Factor5);
		texturePixel.g = (texturePixel.r + texturePixel.g + texturePixel.b) / (3.0 + Factor5);
		texturePixel.b = (texturePixel.r + texturePixel.g + texturePixel.b) / (3.0 + Factor2);
	}
	else
	{
		float distPixel = abs(currentPixelPos.x - lighthenedPoint2.x);
		
		texturePixel.r = mix(0.8 + Factor2 * 2.0, currentColor.r, distPixel/thicknessPixel);
		if(texturePixel.r  < currentColor.r)
		{
			texturePixel.r = currentColor.r;
		}
		texturePixel.g = mix(0.3 + Factor2 * 10.0, currentColor.g, distPixel/thicknessPixel);
		if(texturePixel.g  < currentColor.g)
		{
			texturePixel.g = currentColor.g;
		}
		
		
		/*if(currentPixelPos.x < lighthenedPointX)
		{
			float tempDist = rectDistance(currentPixelPos, 200.0, 300.0);
			float recThickness = 800.0;
			vec4 tempVec = texturePixel;
			
			float offset = 0.10 + Factor4;
			float frequency = 0.02;
			
			texturePixel.r = mix(currentColor.r, 0.8 * 0.1 * Factor4, tempDist/recThickness);
			if(texturePixel.r  < currentColor.r)
			{
				texturePixel.r = currentColor.r;
			}
			
			texturePixel.g = mix(currentColor.g, 0.6 * 0.1 * Factor4, tempDist/recThickness);
			if(texturePixel.g  < currentColor.g)
			{
				texturePixel.g = currentColor.g;
			}
			
			texturePixel.b = mix(currentColor.b, 0.5 * 0.1 * Factor4, tempDist/recThickness);
			if(texturePixel.b  < currentColor.b)
			{
				texturePixel.b = currentColor.b;
			}
			
		}*/
		
		
		//! Left Middle Box
		float distRec = rectDistance(currentPixelPos, 200.0, 300.0);
		
		if(currentPixelPos.x < (400.0 - (200.0 + (Factor2 * 1000.0) + sin(Factor2 * 10000.0))) 
			&& currentPixelPos.x >  (400.0 - (280.0 + (Factor3 * 5000.0) + sin(Factor2 * 10000.0)))
			&& currentPixelPos.y < 350.0 + sin(Factor2) 
			&& currentPixelPos.y > 250.0 + sin(Factor2))
		{
				float tempColor = sin(gl_FragCoord.x * 0.5 + Factor1 * 10.0) * sin(gl_FragCoord.x * 0.5 + Factor1 * 10.0);
				float tempColor2 = cos(gl_FragCoord.x) * cos(gl_FragCoord.x);
				
				resultColor8.r = mix(tempColor, tempColor * 0.8, distRec/thickness6);
				if(resultColor8.r  < 0.0)
				{
					resultColor8.r = 0.0;
				}
				
				resultColor8.g = mix(tempColor2, tempColor2 * 0.5, distRec/thickness6);
				if(resultColor8.g  < 0.0)
				{
					resultColor8.g = 0.0;
				}
				
				resultColor8.b = mix(tempColor2, tempColor2 * 0.3, distRec/thickness6);
				if(resultColor8.b  < 0.0)
				{
					resultColor8.b = 0.0;
				}
			
		}
		
		//! Left Bottom Box
		float distRec3 = rectDistance(currentPixelPos, 250.0, 175.0);

		if(currentPixelPos.x < (400.0 - 100.0) 
			&& currentPixelPos.x >  (400.0 - (150.0 + (Factor9 * 12000.0) + sin(Factor2 * 10000.0)))
			&& currentPixelPos.y < 250.0 + sin(Factor2) 
			&& currentPixelPos.y > 150.0 + sin(Factor2))
		{
			float tempColor = sin(gl_FragCoord.x * 0.5 + Factor1 * 10.0) * sin(gl_FragCoord.x * 0.5 + Factor1 * 10.0);
				
			resultColor8.r = mix(tempColor, tempColor * 0.6, distRec3/thickness6);
			if(resultColor8.r  < 0.0)
			{
				resultColor8.r = 0.0;
			}
			
			resultColor8.g = mix(tempColor, tempColor * 0.8, distRec3/thickness6);
			if(resultColor8.g  < 0.0)
			{
				resultColor8.g = 0.0;
			}
			
			resultColor8.b = mix(1.0, 0.5, distRec3/thickness6);
			if(resultColor8.b  < 0.0)
			{
				resultColor8.b = 0.0;
			}

		}
		
		//! Left Top Box
		float distRec4 = rectDistance(currentPixelPos, 250.0, 425.0);
			
		if(currentPixelPos.x < (400.0 - 100.0) 
			&& currentPixelPos.x >  (400.0 - (150.0 + (Factor3 * 10000.0) + sin(Factor2 * 10000.0)))
			&& currentPixelPos.y < 450.0 + sin(Factor2) 
			&& currentPixelPos.y > 350.0 + sin(Factor2))
		{
			float tempColor = sin(gl_FragCoord.x * 0.5 + Factor1 * 10.0) * sin(gl_FragCoord.x * 0.5 + Factor1 * 10.0);
				
			resultColor8.r = mix(tempColor, tempColor * 0.6, distRec4/thickness6);
			if(resultColor8.r  < 0.0)
			{
				resultColor8.r = 0.0;
			}
		
			resultColor8.g = mix(tempColor, tempColor * 0.8, distRec4/thickness6);
			if(resultColor8.g  < 0.0)
			{
				resultColor8.g = 0.0;
			}
			
			resultColor8.b = mix(1.0, 0.5, distRec4/thickness6);
			if(resultColor8.b  < 0.0)
			{
				resultColor8.b = 0.0;
			}
			
		}
		
		//! Right Middle Box
		float distRec2 = rectDistance(currentPixelPos, 600.0, 300.0);
		
		if(currentPixelPos.x > (400.0 + (200.0 + (Factor2 * 1000.0) + sin(Factor2 * 10000.0))) 
			&& currentPixelPos.x <  (400.0 + (280.0 + (Factor3 * 1000.0) + sin(Factor2 * 10000.0))) 
			&& currentPixelPos.y < 350.0 + sin(Factor2) 
			&& currentPixelPos.y > 250.0 + sin(Factor2))
		{
			float tempColor = sin((gl_FragCoord.x * 0.5) - Factor1 * 10.0 - Factor7 * 50.0)
				* sin((gl_FragCoord.x * 0.5) - Factor1 * 10.0 - Factor7 * 70.0)
				* cos(gl_FragCoord.y * 0.5) 
				* cos(gl_FragCoord.y * 0.5 - Factor2 * 10.0);
		
			
			resultColor8.r = mix(tempColor, tempColor * 0.8, distRec2/thickness6);
			if(resultColor8.r  < 0.0)
			{
				resultColor8.r = 0.0;
			}
			
			resultColor8.g = mix(1.0, 0.5, distRec2/thickness6);
			if(resultColor8.g  < 0.0)
			{
				resultColor8.g = 0.0;
			}
			
			resultColor8.b = mix(tempColor, tempColor * 0.8, distRec2/thickness6);
			if(resultColor8.b  < 0.0)
			{
				resultColor8.b = 0.0;
			}
				
		}
		
		//! Bottom Right Box
		float distRec5 = rectDistance(currentPixelPos, 550.0, 175.0);
	
		if(currentPixelPos.x > (400.0 + 100.0)  
			&& currentPixelPos.x <  (400.0 + (150.0 + (Factor2 * 10000.0) + sin(Factor2 * 10000.0))) 
			&& currentPixelPos.y < 250.0 + sin(Factor2) 
			&& currentPixelPos.y > 150.0 + sin(Factor2))
		{
			float tempColor = sin((gl_FragCoord.x * 0.5) - Factor1 * 10.0 - Factor8 * 20.0)
				* sin((gl_FragCoord.x * 0.5) - Factor1 * 10.0 + Factor8 * 20.0)
				* cos(gl_FragCoord.y * 0.5) 
				* cos(gl_FragCoord.y * 0.5 - Factor2 * 10.0);
		
			
			resultColor8.r = mix(1.0, 0.5, distRec5/thickness6);
			if(resultColor8.r  < 0.0)
			{
				resultColor8.r = 0.0;
			}
			
			resultColor8.g = mix(tempColor, tempColor * 0.8, distRec5/thickness6);
			if(resultColor8.g  < 0.0)
			{
				resultColor8.g = 0.0;
			}
			
			resultColor8.b = mix(1.0, 0.5, distRec5/thickness6);
			if(resultColor8.b  < 0.0)
			{
				resultColor8.b = 0.0;
			}
			
		}
		
		//! Top Right Box
		float distRec6 = rectDistance(currentPixelPos, 550.0, 425.0);
		
		if(currentPixelPos.x > (400.0 + 100.0)  
			&& currentPixelPos.x <  (400.0 + (150.0 + (Factor9 * 12000.0) + sin(Factor2 * 10000.0))) 
			&& currentPixelPos.y < 450.0 + sin(Factor2) 
			&& currentPixelPos.y > 350.0 + sin(Factor2))
		{
			float tempColor = sin((gl_FragCoord.x * 0.5) - Factor1 * 10.0 - Factor8 * 20.0)
				* sin((gl_FragCoord.x * 0.5) - Factor1 * 10.0 + Factor8 * 20.0)
				* cos(gl_FragCoord.y * 0.5) 
				* cos(gl_FragCoord.y * 0.5 - Factor2 * 10.0);
		
			
			resultColor8.r = mix(1.0, 0.5, distRec6/thickness6);
			if(resultColor8.r  < 0.0)
			{
				resultColor8.r = 0.0;
			}
			
			resultColor8.g = mix(tempColor, tempColor * 0.8, distRec6/thickness6);
			if(resultColor8.g  < 0.0)
			{
				resultColor8.g = 0.0;
			}
			
			resultColor8.b = mix(1.0, 0.5, distRec6/thickness6);
			if(resultColor8.b  < 0.0)
			{
				resultColor8.b = 0.0;
			}
			
		}
		
	}
	
	
	
	
	
	//! Ring 1
	float dist2 = radiusDistance(currentPixelPos, abs(circleCenter(400.0, 300.0) - (50000.0 + radius(1500.0, Factor3 * 10.0, 10000.0))));
	
	resultColor.r = mix(1.0, 0.2, dist2/thickness2);
	if(resultColor.r  < 0.0)
	{
		resultColor.r = 0.0;
	}

	resultColor.g = mix(0.6, 0.1, dist2/thickness2);
	if(resultColor.g  < 0.0)
	{
		resultColor.g  = 0.0;
	}

	resultColor.b = mix(1.0, 0.6, dist2/thickness2);
	if(resultColor.b < 0.0)
	{
		resultColor.b = 0.0;
	}
	
	//! Ring 2
	float dist3 = radiusDistance(currentPixelPos, abs(circleCenter(300.0, 350.0) -  (100.0 + radius(500.0, Factor2 * 10.0, 10000.0))));
	
	resultColor2.r = mix(1.0, 0.2, dist3/thickness3);
	if(resultColor2.r  < 0.0)
	{
		resultColor2.r = 0.0;
	}

	resultColor2.g = mix(1.0, 0.8, dist3/thickness3);
	if(resultColor2.g  < 0.0)
	{
		resultColor2.g  = 0.0;
	}

	resultColor2.b = mix(1.0, 0.2, dist3/thickness3);
	if(resultColor2.b < 0.0)
	{
		resultColor2.b = 0.0;
	}
	
	
	//! Ring 3
	float dist4 = radiusDistance(currentPixelPos, abs(circleCenter(500.0 + Factor7 * 1000.0, 360.0 + sin(Factor6) * 20.0 + Factor7 * 1000.0)) 
					- (100.0 + radius(500.0, Factor7 * 10.0, 10000.0)) );
	
	resultColor3.r = mix(1.0, 0.1, dist4/thickness4);
	if(resultColor3.r  < 0.0)
	{
		resultColor3.r = 0.0;
	}

	resultColor3.g = mix(1.0, 0.7, dist4/thickness4);
	if(resultColor3.g  < 0.0)
	{
		resultColor3.g  = 0.0;
	}

	resultColor3.b = mix(1.0, 0.8, dist4/thickness4);
	if(resultColor3.b < 0.0)
	{
		resultColor3.b = 0.0;
	}
	
	
	//! Circle 6
	float dist6 = radiusDistance(currentPixelPos, abs(circleCenter(300.0, 350.0) - (25.0 + radius(300.0, sin(Factor1 * 5.0 + Factor8 * 10.0), 10000.0))));
	
	resultColor4.r = mix(1.0, 0.8, dist6/thickness3);
	if(resultColor4.r  < 0.0)
	{
		resultColor4.r = 0.0;
	}

	resultColor4.g = mix(1.0, 0.1, dist6/thickness3);
	if(resultColor4.g  < 0.0)
	{
		resultColor4.g  = 0.0;
	}

	resultColor4.b = mix(1.0, 0.1, dist6/thickness3);
	if(resultColor4.b < 0.0)
	{
		resultColor4.b = 0.0;
	}

	
	if(Factor2 > 0.8)
	{
		isOver = true;
	}
	else if(Factor2 < 0.5)
	{
		isOver = false;
	}
	
	float tempFactor;
	
	if(isOver)
	{
		tempFactor = (Factor2 * 500.0) - 20.0;
	}
	else
	{
		tempFactor = (Factor2 * 500.0) - 20.0;
	}
	
	float circDist = rectDistance(currentPixelPos, 
					400.0 + ((200.0 - tempFactor) * cos(Factor6 * -1.0)), 
					300.0 + ((200.0  - tempFactor) * sin(Factor6 * -1.0)));
					
	float circThickness = 25.0 + (Factor4 * 0.5);
	
	resultColor9.r = mix(0.6, 0.4, circDist/circThickness);
	if(resultColor9.r < 0.0)
	{
		resultColor9.r = 0.0;
	}
	
	resultColor9.g = mix(1.0, 0.1, circDist/circThickness);
	if(resultColor9.g < 0.0)
	{
		resultColor9.g = 0.0;
	}
	
	resultColor9.b = mix(0.6, 0.3, circDist/circThickness);
	if(resultColor9.b < 0.0)
	{
		resultColor9.b = 0.0;
	}
	
	
	float circDist2 = rectDistance(currentPixelPos, 
					400.0 + abs(100.0 * sin(Factor6 * 0.5) * cos(Factor6)), 
					300.0 + (100.0 * cos(Factor6 * 0.5)));
	
	float circDist3 = rectDistance(currentPixelPos, 
					  400.0 + (100.0 * sin(Factor1 + Factor8 + Factor6 * 0.5) * cos(Factor1 + Factor6) * -1.0),
					  300.0 + (100.0 * cos(Factor1 + Factor8 + Factor6* 0.5)));
					  
	float circThickness2 = 10.0 * sin(Factor7 * 30.0);
	
	//! Figure 8a motion
	resultColor5.r = mix(1.0, 0.8, circDist2/circThickness2);
	if(resultColor5.r < 0.0)
	{
		resultColor5.r = 0.0;
	}
	
	resultColor5.g = mix(1.0, 0.8, circDist2/circThickness2);
	if(resultColor5.g < 0.0)
	{
		resultColor5.g = 0.0;
	}
	
	resultColor5.b = mix(1.0, 0.2, circDist2/circThickness2);
	if(resultColor5.b < 0.0)
	{
		resultColor5.b = 0.0;
	}
	
	//! Figure 8b motion
	resultColor5b.r = mix(1.0, 0.1, circDist3/circThickness2);
	if(resultColor5b.r < 0.0)
	{
		resultColor5b.r = 0.0;
	}
	
	resultColor5b.g = mix(1.0, 0.5, circDist3/circThickness2);
	if(resultColor5b.g < 0.0)
	{
		resultColor5b.g = 0.0;
	}
	
	resultColor5b.b = mix(1.0, 0.8, circDist3/circThickness2);
	if(resultColor5b.b < 0.0)
	{
		resultColor5b.b = 0.0;
	}
	
	
	
	float circDist4 = radiusDistance(currentPixelPos, 
		circleCenter(400.0 + 350.0 * cos((0.0) + 60.0 + Factor1 + Factor3), 300.0 + 350.0 * sin((0.0) + 60.0 + Factor1 + Factor3)));
	
	resultColor6.r = mix(1.0, 0.6, circDist4 / thickness3);
	if(resultColor6.r < 0.0)
	{
		resultColor6.r = 0.0;
	}
		
	resultColor6.g = mix(1.0, 0.6, circDist4 / thickness3);
	if(resultColor6.g < 0.0)
	{
		resultColor6.g = 0.0;
	}
		
	resultColor6.b = mix(1.0, 0.2, circDist4 / thickness3);
	if(resultColor6.b < 0.0)
	{
		resultColor6.b = 0.0;
	}
	
	
	
	float subCircleX =  400.0 + 350.0 * cos((0.0) + 60.0 + Factor1);
	float subCircleY =  300.0 + 350.0 * sin((0.0) + 60.0 + Factor1);
	float subCircleX2 = subCircleX + 50.0 * cos(0.0 + Factor1 * -10.0);
	float subCircleY2 =  subCircleY + 50.0 * sin(0.0 + Factor1 * -10.0);
	float subCircleX3 = subCircleX + 50.0 * cos(180.0 + Factor6);
	float subCircleY3 = subCircleY + 50.0 * sin(180.0 + Factor6);
	
	//float subCircle = circleCenter(subCircleX + 50.0 * cos(0.0 + Factor1 * -10.0), subCircleY + 50.0 * sin(0.0 + Factor1 * -10.0));
	//float subCircle2 = circleCenter(subCircleX + 50.0 * cos(100.0 + Factor1 * 10.0), subCircleY + 50.0 * sin(0.0 + Factor1 * 10.0));
	
	float subDistance = rectDistance(currentPixelPos, subCircleX2, subCircleY2);
	float subDistance2 = rectDistance(currentPixelPos, subCircleX3, subCircleY3);
	
	float subRadius = 100.0 * Factor3;
	float subRadius2 = 10.0 + (Factor4 * 0.5);
	
	float tempMin;
	float tempMin2;
	
	if(Factor2 > 0.8)        tempMin = 0.8;
	else if(Factor2 < 0.8)   tempMin = 0.6;
	
	if(Factor8 > 0.5)        tempMin2 = 0.5;
	else                     tempMin2 = 0.3;
	
	resultColor7.r = mix(1.0, tempMin, subDistance / subRadius2);
	if(resultColor7.r < 0.0)
	{
		resultColor7.r = 0.0;
	}
	
	resultColor7.g = mix(0.8, tempMin2, subDistance / subRadius2);
	if(resultColor7.g < 0.0)
	{
		resultColor7.g = 0.0;
	}
	
	resultColor7.b = mix(0.8, tempMin2, subDistance / subRadius2);
	if(resultColor7.b < 0.0)
	{
		resultColor7.b = 0.0;
	}
	
	resultColor7b.r = mix(0.6, tempMin2, subDistance2 / subRadius);
	if(resultColor7b.r < 0.0)
	{
		resultColor7b.r = 0.0;
	}
	
	resultColor7b.g = mix(0.8, tempMin2, subDistance2 / subRadius);
	if(resultColor7b.g < 0.0)
	{
		resultColor7b.g = 0.0;
	}
	
	resultColor7b.b = mix(1.0, tempMin, subDistance2 / subRadius);
	if(resultColor7b.b < 0.0)
	{
		resultColor7b.b = 0.0;
	}
	
	float damping;
	
	if (Factor2 < 0.05)
		{
		if (damping > 0.0)
		{
			damping -= 0.0025;
		}
	}
	else if (damping > 0.0)
	{
		damping = Factor2;
	}
	

	for(float i = 0.0; i < 20.0; i+= 2.0)
	{
		if(circleCenter(400.0 + (250.0 + sin(Factor1 * 10000.0) + (Factor2 + damping )* 500.0) * cos((i * 60.0) + 60.0 + Factor1 + (Factor7 * -5.0)), 
		300.0 + (250.0 + sin(Factor1 * 10000.0) + (Factor2 + damping )* 500.0) * sin((i * 60.0) + 60.0 + Factor1 + (Factor7 * -5.0))) < radius(10.0, 10.0, 10.0))
		{
			resultColor6.r = 0.5;
			resultColor6.g = 0.7;
			resultColor6.b = 1.0;
		}
	}
	

	gl_FragColor = vec4(r,g,b, 1.0) + texturePixel + resultColor + resultColor2 
				   + resultColor3 + resultColor4 + resultColor5 + resultColor5b
				   + resultColor6 + resultColor7 + resultColor7b + resultColor8
				   + resultColor9;
	
}


