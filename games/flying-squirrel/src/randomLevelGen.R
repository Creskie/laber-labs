set.seed(12075)

numLevels = 1000

colorTheme = sample(1:8, numLevels, replace = TRUE)
#colorTheme = rep(1:8, numLevels/8)
treeType = sample(1:4, numLevels, replace = TRUE)
skyType = sample(1:2, numLevels, replace = TRUE)
starInd = sample(0:1, numLevels, replace = TRUE)
groundType = sample(1:2, numLevels, replace = TRUE)
groundY1 = runif(1000, 250, 350)
groundY2 = runif(1000, 250, 350)
groundY3 = runif(1000, 250, 350)

groundY = cbind(groundY1, groundY2, groundY3)
groundY = t(apply(groundY,1,sort))

groundX = matrix(c(-100,200,500),nrow=numLevels,ncol=3,byrow = TRUE)
groundX = t(apply(groundX,1,sample))

treeYAdj = matrix(runif(numLevels*3, 200 , 230), nrow=numLevels, ncol = 3)
treeY = groundY + treeYAdj 

treeXAdj = matrix(runif(numLevels*3, 200 , 300), nrow=numLevels, ncol = 3)
treeX = groundX + treeXAdj 

groundImgType = matrix(sample(1:3, numLevels*3, replace = TRUE), nrow = numLevels, ncol = 3)

skyX = runif(1000, 580, 620)
skyY = runif(1000, 30, 70)

starX = cbind(runif(numLevels, 50, 150), runif(numLevels, 150,250), 
              runif(numLevels, 250,350), runif(numLevels, 350,450), 
              runif(numLevels, 450,550), runif(numLevels, 650,750))

starY = cbind(runif(numLevels, 10, 70), runif(numLevels, 10,70), 
              runif(numLevels, 10,70), runif(numLevels, 10,70), 
              runif(numLevels, 10,70), runif(numLevels, 10,70))

randomLevelData = cbind(colorTheme, treeType, skyType, starInd, groundType, 
                  groundY, groundX, treeY, treeX, groundImgType, skyX, skyY, starX, starY)

write.table(randomLevelData, file="randomLevelData.csv", row.names = FALSE, col.names = FALSE, sep=",")
