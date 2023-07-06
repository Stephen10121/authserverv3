<div class="extraInfo">
    <p>?</p>
    <div class="show">
        <slot />
    </div>
</div>

<style>
    
    .extraInfo p {
      width: 20px;
      height: 20px;
      background-color: black;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 1px;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      font-family: "Roboto", sans-serif;
      font-weight: bold;
      user-select: none;
    }
  
    .show {
      opacity: 0;
      visibility: hidden;
      width: 200px;
      height: 100px;
      background-color: green;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
      transition: 0.25s;
      font-family: "Roboto", sans-serif;
      padding: 10px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.7);
      color: #dfdfdf;
    }
  
    .extraInfo:hover .show {
      opacity: 1;
      visibility: visible;
    }
</style>