library(turfR)
Ncols=30
Nrows=100
A=data.frame(cbind(respid=1:Nrows,wgt=1,--(matrix(runif(Nrows*Ncols),byrow=TRUE,nrow=Nrows)>.7)))
turf(A,Ncols,3)