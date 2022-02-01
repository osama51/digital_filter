import numpy as np
from numpy import log10,abs,max,min,pi,unwrap,arctan2,imag,real
from matplotlib.pyplot import plot,show,ylabel,xlabel,title,ylim
from numpy.polynomial import Polynomial , polynomial
from scipy import signal
import pandas as pd





data = pd.read_csv("E:/JavaScript/dsp_5/p5way/emg.csv")
signal_name = data.columns[1]
amplitude = data.iloc[:, 1] # gets second column
time = data.iloc[:, 0]

numerator =[-.7,.2j,-.2j,.3, -.1, -.9, .6, .3j]
denomenetor=[0 ]
#r = np.poly([-1, 1])
#p = np.poly1d(r) 
b = polynomial.polyfromroots(numerator)
a = polynomial.polyfromroots(denomenetor)
b= np.flip(b)
a= np.flip(a)

pp = []

#get xi from you them pass it here and 
def difference_equ_z(data,z_n,p_n,z_coeffs,p_coeffs):
    x=[]
    y=[]
    pp = [1]
    print(z_coeffs)
    for xi in data:
        if z_n > p_n:
            x.append(xi)
            if len(x) >= z_n:
                current_index= len(x)
                # x_df=np.array(x[current_index-z_n-1:current_index])
                # y_df=np.array(y[current_index-p_n-2:current_index-1])
                x_df=np.array(x[-z_n:])
                y_df=np.array(y[-p_n+1:])
                # y_new = np.dot(z_coeffs,x_df)-np.dot(p_coeffs,y_df)
                y_new = np.dot(z_coeffs,x_df)
                y_new -= np.dot(p_coeffs,y_df)
                y.append(y_new)
            else:
                y.append(xi) 
        elif p_n > z_n :
            x.append(xi)
            if len(y) >= p_n:
                current_index= len(y)# np.max([len(y),len(x)])
                # x_df=np.array(x[current_index-z_n-1:current_index])
                # y_df=np.array(y[current_index-p_n-1:current_index])
                x_df=np.array(x[-z_n:])
                y_df=np.array(y[-p_n+1:])
                
                y_new = np.dot(z_coeffs,x_df)
                y_new -= np.dot(p_coeffs,y_df)
                y.append(y_new)
            else:
                y.append(xi)
    return y

yy = difference_equ_z(amplitude,len(b),len(a),b,a[1:])
print("pp", pp)

plot(time[0:1000], amplitude[0:1000], time[0:1000], yy[0:1000])
show()

# def tf_freqz_phasez(b,a=1):
#     w,h = signal.freqz(b,a)
#     h_dB = 20 * log10 (abs(h))
#     h_phase = unwrap(arctan2(imag(h),real(h)))
#     return w,h_dB,h_phase
    
# mags,phases=tf_freqz_phasez(b,a)

#print(np.dot(mags,phases))
'''
    plot(w/pi, h_dB)
    #ylim([max(min(h_dB), -100) , 5])
    ylabel('Magnitude (db)')
    title(r'Amplitude response')
    show()
def plot_phasez(b, a=1):
    w,h = signal.freqz(b,a)

    plot(w/pi, h_Phase)
    ylabel('Phase (radians)')
    title(r'Phase response')
    show()'''
#xlabel(r'Normalized Frequency (x$\pi$rad/sample)')

 
    