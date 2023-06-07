<script lang="ts">
    import lockImage from "../../assets/lock.svg";
</script>

<button id="sauth-login" on:click>
    Login with Gruzservices
    <span>
        <img src={lockImage} alt="Lock" />
    </span>
</button>
  
  <style>
    @font-face {
      font-family: "George-Italic";
      src: url(/fonts/Louis-George-Cafe-Italic.ttf);
    }
  
    #sauth-login {
      width: 220px;
      font-size: 0.9rem;
      font-family: "George-Italic", sans-serif;
      border-radius: 100vw;
      border: none;
      background-color: #ffffff;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      height: 50px;
      cursor: pointer;
      transition: box-shadow 0.25s linear;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  
    #sauth-login span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    #sauth-login:hover {
      box-shadow: rgba(0, 0, 0, 0.24) 0px 8px 8px;
    }
  </style>