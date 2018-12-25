#define GLFW_INCLUDE_ES2 1
#define GLFW_DLL 1
//#define GLFW_EXPOSE_NATIVE_WIN32 1
//#define GLFW_EXPOSE_NATIVE_EGL 1

#include <GLES2/gl2.h>
#include <EGL/egl.h>

#include <GLFW/glfw3.h>
//#include <GLFW/glfw3native.h>
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <string>
#include <fstream> 
#include "lodepng.h"

#include <fmod.hpp>
#include <fmod_errors.h>


#define WINDOW_WIDTH 800
#define WINDOW_HEIGHT 600

#define SPECTRUM_SIZE 64

#define TEXTURE_COUNT 2

GLint GprogramID = -1;
GLuint GTextureID[TEXTURE_COUNT];

GLFWwindow* window;

FMOD::System* m_fmodSystem;
FMOD::Sound* m_music;
FMOD::Channel *m_musicChannel;

float m_spectrumLeft[SPECTRUM_SIZE];
float m_spectrumRight[SPECTRUM_SIZE];

void ERRCHECK(FMOD_RESULT result)
{
	if (result != FMOD_OK)
	{
		std::cout << "FMOD error! " << FMOD_ErrorString(result) << std::endl;
	}
}

void initFmod()
{
	FMOD_RESULT     result;
	unsigned int    version;

	result = FMOD::System_Create(&m_fmodSystem);
	ERRCHECK(result);

	result = m_fmodSystem->getVersion(&version);
	ERRCHECK(result);

	if (version < FMOD_VERSION)
	{
		std::cout << "FMOD Error! You are using an old version of FMOD" << std::endl;
	}

	//! initialize fmod system
	result = m_fmodSystem->init(32, FMOD_INIT_NORMAL, 0);
	ERRCHECK(result);

	//! load and set up music
	result = m_fmodSystem->createStream("../media/Homecoming.mp3", FMOD_SOFTWARE, 0, &m_music);
	//result = m_fmodSystem->createStream("../media/MyBody.mp3", FMOD_SOFTWARE, 0, &m_music);
	ERRCHECK(result);

	//! play the loaded mp3 music
	result = m_fmodSystem->playSound(FMOD_CHANNEL_FREE, m_music, false, &m_musicChannel);
	ERRCHECK(result);

	//! set sound channel loop count
	//m_musicChannel->setLoopCount(10);

}

void updateFmod()
{
	m_fmodSystem->update();

	//! Get spectrum for left and right stereo channels
	m_musicChannel->getSpectrum(m_spectrumLeft, SPECTRUM_SIZE, 0, FMOD_DSP_FFT_WINDOW_RECT);
	m_musicChannel->getSpectrum(m_spectrumRight, SPECTRUM_SIZE, 1, FMOD_DSP_FFT_WINDOW_RECT);

	//! test
	std::cout << m_spectrumLeft[0] << ", " << m_spectrumRight[0] << std::endl;
}

static void error_callback(int error, const char* description)
{
  fputs(description, stderr);
}

void loadTexture(const char* path, GLuint textureID)
{
	std::vector<unsigned char> image;
	unsigned width, height;
	unsigned error = lodepng::decode(image, width, height, path);

	if (error != 0)
	{
		std::cout << "png load error: " << error << ": " << lodepng_error_text(error) << std::endl;
		return;
	}

	glBindTexture(GL_TEXTURE_2D, textureID);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

	//! bilinear filtering
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);

	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, width, height, 0, GL_RGBA, GL_UNSIGNED_BYTE, &image[0]);

}

GLuint LoadShader(GLenum type, const char *shaderSrc )
{
   GLuint shader;
   GLint compiled;
   
   // Create the shader object
   shader = glCreateShader ( type );

   if ( shader == 0 )
   	return 0;

   // Load the shader source
   glShaderSource ( shader, 1, &shaderSrc, NULL );
   
   // Compile the shader
   glCompileShader ( shader );

   // Check the compile status
   glGetShaderiv ( shader, GL_COMPILE_STATUS, &compiled );

   if ( !compiled ) 
   {
      GLint infoLen = 0;

      glGetShaderiv ( shader, GL_INFO_LOG_LENGTH, &infoLen );
      
      if ( infoLen > 1 )
      {
		 char infoLog[4096];
         glGetShaderInfoLog ( shader, infoLen, NULL, infoLog );
         printf ( "Error compiling shader:\n%s\n", infoLog );            
      }

      glDeleteShader ( shader );
      return 0;
   }

   return shader;
}

GLuint LoadShaderFromFile(GLenum shaderType, std::string path)
{
    GLuint shaderID = 0;
    std::string shaderString;
    std::ifstream sourceFile( path.c_str() );

    if( sourceFile )
    {
        shaderString.assign( ( std::istreambuf_iterator< char >( sourceFile ) ), std::istreambuf_iterator< char >() );
        const GLchar* shaderSource = shaderString.c_str();

		return LoadShader(shaderType, shaderSource);
    }
    else
        printf( "Unable to open file %s\n", path.c_str() );

    return shaderID;
}


int Init ( void )
{
   GLuint vertexShader;
   GLuint fragmentShader;
   GLuint programObject;
   GLint linked;

   vertexShader = LoadShaderFromFile(GL_VERTEX_SHADER, "../vertexShader1.vert" );
   fragmentShader = LoadShaderFromFile(GL_FRAGMENT_SHADER, "../fragmentShader1.frag" );

   glGenTextures(TEXTURE_COUNT, GTextureID);
   loadTexture("../media/Hippy2.png", GTextureID[0]);
  // loadTexture("../media/Texture2.png", GTextureID[0]);

   // Create the program object
   programObject = glCreateProgram ( );
   
   if ( programObject == 0 )
      return 0;

   glAttachShader ( programObject, fragmentShader );
   glAttachShader ( programObject, vertexShader );


   // Bind vPosition to attribute 0   
   glBindAttribLocation ( programObject, 0, "vPosition" );
   glBindAttribLocation ( programObject, 1, "vColor" );
   glBindAttribLocation ( programObject, 2, "vTexCoord" );

   // Link the program
   glLinkProgram ( programObject );

   // Check the link status
   glGetProgramiv ( programObject, GL_LINK_STATUS, &linked );

   if ( !linked ) 
   {
      GLint infoLen = 0;

      glGetProgramiv ( programObject, GL_INFO_LOG_LENGTH, &infoLen );
      
      if ( infoLen > 1 )
      {
         //char* infoLog = malloc (sizeof(char) * infoLen );
		 char infoLog[512];
         glGetProgramInfoLog ( programObject, infoLen, NULL, infoLog );
         printf ( "Error linking program:\n%s\n", infoLog );            
         
         //free ( infoLog );
      }

      glDeleteProgram ( programObject );
      return 0;
   }

   // Store the program object
   GprogramID = programObject;

   glClearColor ( 0.0f, 0.0f, 0.0f, 0.0f );
   glEnable(GL_BLEND);
   glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
   initFmod();

   return 1;
}

void setFactor(GLint factorLoc, float factor)
{
	if (factorLoc != -1)
	{
		glUniform1f(factorLoc, factor);
	}
}

void Draw(void)
{
	//! set the sampler2D varying variable to the first texture unit (index 0)
	glUniform1i(glGetUniformLocation(GprogramID, "sampler2d"), 0);
	
	static float factor1 = 0.0f;
	static float factor2 = 0.0f;
	static float factor3 = 0.0f;
	static float factor4 = 0.0f;
	static float factor5 = 0.0f;
	static float factor6 = 0.0f;
	static float factor7 = 0.0f;
	static float factor8 = 0.0f;
	static float factor9 = 0.0f;

	factor1 += 0.005;
	factor2 = m_spectrumLeft[5];
	factor3 = m_spectrumLeft[2];
	factor4 = sin(m_spectrumLeft[8] * 10000.0 + factor1) * 10.0;
	factor5 = sin(m_spectrumLeft[10] * 100000.0);
	factor6 += 0.05 + (m_spectrumLeft[6]);
	factor7 = m_spectrumLeft[20];
	factor8 = m_spectrumLeft[12];
	factor9 = m_spectrumLeft[3];

	GLint factor1Loc = glGetUniformLocation(GprogramID, "Factor1");
	GLint factor2Loc = glGetUniformLocation(GprogramID, "Factor2");
	GLint factor3Loc = glGetUniformLocation(GprogramID, "Factor3");
	GLint factor4Loc = glGetUniformLocation(GprogramID, "Factor4");
	GLint factor5Loc = glGetUniformLocation(GprogramID, "Factor5");
	GLint factor6Loc = glGetUniformLocation(GprogramID, "Factor6");
	GLint factor7Loc = glGetUniformLocation(GprogramID, "Factor7");
	GLint factor8Loc = glGetUniformLocation(GprogramID, "Factor8");
	GLint factor9Loc = glGetUniformLocation(GprogramID, "Factor9");

	setFactor(factor1Loc, factor1);
	setFactor(factor2Loc, factor2);
	setFactor(factor3Loc, factor3);
	setFactor(factor4Loc, factor4);
	setFactor(factor5Loc, factor5);
	setFactor(factor6Loc, factor6);
	setFactor(factor7Loc, factor7);
	setFactor(factor8Loc, factor8);
	setFactor(factor9Loc, factor9);

   GLfloat vVertices[] = {  -1.0f, 1.0f, 0.0f,
							-1.0f, -1.0f, 0.0f,
						    1.0f, 1.0f, 0.0f,
						    1.0f, 1.0f, 0.0f,
							1.0f, -1.0f, 0.0f,
							-1.0f, -1.0f, 0.0f };


   GLfloat vColors[] = { 1.0f, 0.0f, 0.0f, 1.0f,
	                     0.0f, 1.0f, 0.0f, 1.0f,
	                     0.0f, 0.0f, 1.0f, 1.0f,
						 0.0f, 0.0f, 1.0f, 1.0f,
						 1.0f, 0.0f, 0.0f, 1.0f,
						 0.0f, 1.0f, 0.0f, 1.0f };

  static GLfloat vTexCoords[] = { 0.0f, 0.0f,
								  0.0f, 1.0f,
								  1.0f, 0.0f,
								  1.0f, 0.0f,
								  1.0f, 1.0f,
								  0.0f, 1.0f, };



   glBindTexture(GL_TEXTURE_2D, GTextureID[0]);

   // Set the viewport
   glViewport(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

   // Clear the color buffer
   glClear(GL_COLOR_BUFFER_BIT);

   // Use the program object
   glUseProgram(GprogramID);

   // Load the vertex data
   glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, vVertices);
   glVertexAttribPointer(1, 4, GL_FLOAT, GL_FALSE, 0, vColors);
   glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 0, vTexCoords);

   glEnableVertexAttribArray(0);
   glEnableVertexAttribArray(1);
   glEnableVertexAttribArray(2);

   glDrawArrays(GL_TRIANGLES, 0, 6);

   glDisableVertexAttribArray(0);
   glDisableVertexAttribArray(1);
   glDisableVertexAttribArray(2);

   glDisable(GL_BLEND);

}

int main(void)
{
  glfwSetErrorCallback(error_callback);

  // Initialize GLFW library
  if (!glfwInit())
    return -1;

  glfwDefaultWindowHints();
  glfwWindowHint(GLFW_CLIENT_API, GLFW_OPENGL_ES_API);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 2);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 0);

  // Create and open a window
  window = glfwCreateWindow(WINDOW_WIDTH,
                            WINDOW_HEIGHT,
                            "Hello World",
                            NULL,
                            NULL);

  if (!window)
  {
    glfwTerminate();
    printf("glfwCreateWindow Error\n");
    exit(1); 
  }

  glfwMakeContextCurrent(window);

  Init();

  // Repeat
  while (!glfwWindowShouldClose(window)) {

	updateFmod();
	Draw();
    glfwSwapBuffers(window);
    glfwPollEvents();
  }

  glfwDestroyWindow(window);
  glfwTerminate();
  exit(EXIT_SUCCESS);
}
