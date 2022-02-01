
import eel
import numpy as np
import pandas as pd
from scipy import signal
import matplotlib.pyplot as plt
from numpy.polynomial import polynomial as P

  
eel.init("web")  
  
zeros=[]
poles=[]

# b = []
# a = []

# Exposing the random_python function to javascript
@eel.expose    
def plot_freqz(bx, by, ax=1, ay=1):
    # b = list(map(lambda x, y: complex(x, y), bx, by))
    
    # #b = np.array(b)
    # b = P.polyfromroots(b)
    
    # # b = b.astype(np.float32)
    # #b.dtypes.head()
    # a = list(map(lambda x, y: complex(x, y), ax, ay))
    # #a = np.array(a)
    # # a = a.astype(np.float32)
    # #a.dtypes.head()
    # a = P.polyfromroots(a)
    
    w,h = signal.freqz(b,a)
    h_dB = 20 * np.log10 (abs(h))
    # plt.plot(w, h_dB)
    #plt.ylim([max(min(h_dB), -100) , 5])
    # plt.ylabel('Magnitude (db)')
    # plt.xlabel(r'Normalized Frequency (x$\pi$rad/sample)')
    # plt.title(r'Amplitude response')
    # plt.show()
    # print(h_dB)
    h_dB = list(h_dB)
    return h_dB;
    
@eel.expose
def plot_phasez(bx, by, ax=[0], ay=[0]):
    # b = list(map(lambda x, y: complex(x, y), bx, by))
    # #b = np.array(b)
    # b = P.polyfromroots(b)
    
    # # b = b.astype(np.float32)
    # #b.dtypes.head()
    # a = list(map(lambda x, y: complex(x, y), ax, ay))
    # #a = np.array(a)
    # # a = a.astype(np.float32)
    # #a.dtypes.head()
    # a = P.polyfromroots(a) 
    
    w,h = signal.freqz(b,a)
    # h_Phase = np.unwrap(np.arctan2(np.imag(h),np.real(h)))
    h_Phase = np.arctan2(np.imag(h),np.real(h))
    # plt.plot(w, h_Phase)
    # plt.ylabel('Phase (radians)')
    # plt.xlabel(r'Normalized Frequency (x$\pi$rad/sample)')
    # plt.title(r'Phase response')
    # plt.show()
    # print(h_Phase)
    h_Phase = list(h_Phase)
    return h_Phase;


@eel.expose
def W(bx, by, ax=1, ay=1):
    global b
    global a
    b = list(map(lambda x, y: complex(x, y), bx, by))

    b = P.polyfromroots(b)

    a = list(map(lambda x, y: complex(x, y), ax, ay))

    a = P.polyfromroots(a) 
    # print("a", a, "b", b)
    w,h = signal.freqz(b,a)
    w = list(w)
    return w;

@eel.expose
def difference_equ_z(data):
    # print("data", data)
    print("IM INNNNNNN")
    z_coeffs = np.abs(b)
    p_coeffs = np.abs(a[1:])
    z_n = len(z_coeffs)
    p_n = len(p_coeffs)
    x=[]
    y=[]
    # print(z_coeffs)
    for xi in data:
        if (xi == None): x.append(0)
        else: x.append(xi)
        if z_n >= p_n :
            
            if len(x) >= z_n:
                # current_index= len(x)
                # x_df=np.array(x[current_index-z_n-1:current_index])
                # y_df=np.array(y[current_index-p_n-2:current_index-1])
                # print("x",x)
                x_df = np.array(x[-z_n:])
                y_df = np.array(y[-(p_n):])
                # print("if len(x) >= z_n:")
                # print("X_DF", x_df)
                # y_new = np.dot(z_coeffs,x_df)-np.dot(p_coeffs,y_df)
                y_new = np.dot(z_coeffs,x_df)
                y_new -= np.dot(p_coeffs,y_df)
                y.append(y_new)
            else:
                y.append(xi) 
                # print(" else:y.append(xi) ")
        elif p_n > z_n :
            
            if len(y) >= p_n:
                # current_index= len(y)# np.max([len(y),len(x)])
                # x_df=np.array(x[current_index-z_n-1:current_index])
                # y_df=np.array(y[current_index-p_n-1:current_index])
                x_df=np.array(x[-z_n:])
                y_df=np.array(y[-p_n+1:])
                # print(" if len(y) >= p_n:")
                y_new = np.dot(z_coeffs,x_df)
                y_new -= np.dot(p_coeffs,y_df)
                y.append(y_new)
            else:
                y.append(xi)
                # print("else: y.append(xi) y = list(y)")
    print('ananana')
    y = list(y)
    # print("data", x_df)
    exporting_to_csv(y)
    # return y
  
def exporting_to_csv(data):
    # data = {'time': list(np.arange(0,1000,1)),'signal': self.composer_list }
    print("im exporting, my lord!")
    df = pd.DataFrame(data)
    # name = QFileDialog.getSaveFileName(self, 'Save File')
    df.to_csv ("web/filteredemg.csv", index = False, header=False)
    
# plot_freqz(b,a)
# plot_phasez(b,a)
# print(b)
# # Start the index.html file
eel.start("index.html")