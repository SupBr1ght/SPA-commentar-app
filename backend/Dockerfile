# 1. Бbasic mount
FROM node:20

# 2. working dir
WORKDIR /app

# 3. copy files package.json and package-lock.json
COPY package*.json ./

# 4. install dependency
RUN npm install

# 5. copy all
COPY . .

# 6. collect TypeScript 
RUN npm run build

# 7. port
EXPOSE 3000

# 8. start
CMD ["npm", "run", "start:prod"]
