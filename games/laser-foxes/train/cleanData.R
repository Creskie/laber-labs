rm(list=ls(all=TRUE))

# read in
trace <- read.csv("~/NCSU 15-16/laserfoxesJS2/src/out.csv")

# process data
data <- trace
data$playerShotLaser <- as.integer(data$playerShotLaser == "true")
data$playerPickedUpPowerUp <- as.integer(data$playerPickedUpPowerUp == "true")
data$playerGotHit <- as.integer(data$playerGotHit == "true")
data$playerAlive <- as.integer(data$playerAlive == "true")

data$enemyShotLaser <- as.integer(data$enemyShotLaser == "true")
data$enemyPickedUpPowerUp <- as.integer(data$enemyPickedUpPowerUp == "true")
data$enemyGotHit <- as.integer(data$enemyGotHit == "true")
data$enemyAlive <- as.integer(data$enemyAlive == "true")

# fresh data frame to fill
cleanData <- data.frame()

# frames per period
lenPeriods <- 60
for (game in 0:max(data$game)){
    # frames per game
    numFrames <- length(data[data$game==game,"frame"])
    print(numFrames)
    # periods per game
    numPeriods <- floor(numFrames/lenPeriods)
    
    gameData = data[data$game==game,]
    
    # loop through periods
    for (per in 1:numPeriods){
        
        # subset by period
        gamePerData = gameData[((per-1)*lenPeriods+1):(per*lenPeriods),]
        
        ## number of shots
        numPlayerLasers <- sum(gamePerData$playerShotLaser)
        ## if powerup is picked up (yes or no)
        pickedUpPowerUp <- max(gamePerData$playerPickedUpPowerUp)
        
        ## check if died during period
        if(any(gamePerData$playerAlive == 0)){
            alive <- which(gamePerData$playerAlive == 1)
            dead <- which(gamePerData$playerAlive == 0)
            if (min(alive) < max(dead)){
                die <- 1
            }
            else{
                die <- 0
            }
        }
        else{
            die <- 0
        }
        
        ## check if enemy died in period
        if(any(gamePerData$enemyAlive == 0)){
            alive <- which(gamePerData$enemyAlive == 1)
            dead <- which(gamePerData$enemyAlive == 0)
            if (min(alive) < max(dead)){
                kill <- 1
            }
            else{
                kill <- 0
            }
        }
        else{
            kill <- 0
        }
        
        ## total euclidean distance moved
        ## diff does sequential differences
        dx <- diff(gamePerData$playerX)
        dy <- diff(gamePerData$playerY)
        distanceMoved <- sum(sqrt(dx^2 + dy^2))
        
        
        ## distances to opponent
        ## initial, final, change in, max, min
        distanceOppX <- gamePerData$playerX - gamePerData$enemyX
        distanceOppY <- gamePerData$playerY - gamePerData$enemyY
        distanceOpp <- sqrt(distanceOppX^2 + distanceOppY^2)
        minDistanceOpp <- min(distanceOpp)
        maxDistanceOpp <- max(distanceOpp)
        avgDistanceOpp <- mean(distanceOpp)
        initialDistanceOpp <- distanceOpp[1]
        finalDistanceOpp <- distanceOpp[lenPeriods]
        diffDistanceOpp <- finalDistanceOpp - initialDistanceOpp
        
        ## energy
        energy <- gamePerData$playerEnergy
        initialEnergy <- energy[1]
        finalEnergy <- energy[lenPeriods]
        changeEnergy <- finalEnergy - initialEnergy
        avgEnergy <- mean(energy)
        minEnergy <- min(energy)
        maxEnergy <- max(energy)
        
        
        
        playerClass <- data[data$game==game,"playerClass"][1]
        
        Obs <- c(playerClass, numPlayerLasers, distanceMoved,
                 initialDistanceOpp, finalDistanceOpp, diffDistanceOpp,
                 pickedUpPowerUp, die, kill,minDistanceOpp,maxDistanceOpp,
                 avgDistanceOpp, initialEnergy, finalEnergy, changeEnergy,
                 avgEnergy, minEnergy, maxEnergy)
        
        cleanData <- rbind(cleanData,Obs)
    }
}

names(cleanData) <- c("Class","numLasersShot","distanceMoved",
                      "initialDist","finalDist","diffDist","powerUp",
                      "Die","Kill","minDistOpp","maxDistOpp",
                      "avgDistOpp","initialEnergy","finalEnergy",
                      "changeEnergy","avgEnergy","minEnergy",
                      "maxEnergy")

res <- cleanData
res$Class <- as.factor(res$Class)

library(plyr)
results <- res
results$Class <- mapvalues(results$Class, from = c("1","2","3","4"), to = c("Aggressor","Camper","Evader","Forager"))

write.csv(results,file="cleanedData.csv",row.names=FALSE)
