using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

//variant 2
namespace Lab1
{
    class Program
    {
        private static string _nick;
        private static EndPoint _remotePoint;
        private static readonly Socket Socket = new (AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
        private static readonly List<string> Messages = new();
        private static Guid id;
        private static Guid guestId;
        private const char SeparatorStick= '|';
        private const char Slash= '/';
        
    
        private static void StartPage()
        {
            try
            {
                Console.Clear();
                Console.WriteLine("Enter your nickname!");
                _nick = Console.ReadLine();
                Console.Clear();
                Console.WriteLine("Hello, " + _nick);
                Console.WriteLine("Enter your port");
                var myPort = Convert.ToInt32(Console.ReadLine());
                Console.WriteLine("Enter ip of your companion");
                var ip = Console.ReadLine();
                Console.WriteLine("Enter port of your companion");
                var port = Convert.ToInt32(Console.ReadLine());
                Console.WriteLine("Do u already have your id? Y/any other");
                if (Console.ReadLine() == "Y")
                {
                    Console.WriteLine("Write your id to recover");
                    try
                    {
                        id = new Guid(Console.ReadLine());
                    }
                    catch(Exception ex)
                    {
                        Error(ex.Message);
                        StartPage();
                    }
                }
                else
                {
                    id = Guid.NewGuid();
                    Console.WriteLine($"Here is your generated id:\n{id}\nCopy it to paste then to recover message history.");
                    Console.ReadKey();
                    Console.WriteLine("Last chance to copy");
                    Console.ReadKey();
                }
                Socket.Bind(new IPEndPoint(IPAddress.Parse("127.0.0.1"), myPort));
                _remotePoint = new IPEndPoint(IPAddress.Parse(ip), port);
                
                Console.WriteLine();
                Console.Clear();
                
            }
            catch
            {
                Error("Wrong format");
                Thread.Sleep(1500);
                StartPage();
            }
        }

        private static void ReceiveMessages()
        { 
            try
            {
                while (true)
                {
                    StringBuilder value = new ();
                    var data = new byte[256];
                    do
                    {
                        var bytes = Socket.ReceiveFrom(data, ref _remotePoint);
                        value.Append(Encoding.Unicode.GetString(data, 0, bytes));
                    }
                    while (Socket.Available > 0);
                    var temp = "";
                    switch (value[0])
                    {
                        case SeparatorStick:
                            RecoverMessages(value.ToString());
                            continue;
                        case Slash:
                            SendAllMessages();
                            continue;
                    }

                    for (var i = 0; i < value.Length; i++)
                    {
                        if (value[i] != SeparatorStick)
                        {
                            temp += value[i];
                        }
                        else
                        {
                            value.Remove(0, i + 1);
                            guestId = new Guid(temp);
                            AddMessage(new Guid(temp), value.ToString());
                            DisplayMessageHistory();
                        }
                    }
                }
            
            }
            catch(Exception ex)
            {
                Error(ex.Message);
            }
        }

        private static void SendMessage()
        {
            while (true)
            {
                var messageText = Console.ReadLine();
                if (messageText == "/recover")
                {
                    var recoverAssign = Encoding.Unicode.GetBytes(Slash + id.ToString());
                    Socket.SendTo(recoverAssign, _remotePoint);
                    continue;
                }
                var message = _nick + ": " + messageText;
                if (guestId == default)
                {
                    Messages.Add(message);
                }
                else
                {
                    AddMessage(guestId, message);
                }
                DisplayMessageHistory();
                var data = Encoding.Unicode.GetBytes(id + SeparatorStick.ToString() + message);
                Socket.SendTo(data, _remotePoint);
                Thread.Sleep(500);
            }
        }

        private static void SendAllMessages()
        {
            var data = Encoding.Unicode.GetBytes( SeparatorStick.ToString() + id + SeparatorStick.ToString() + File.ReadAllText(Environment.CurrentDirectory + $"/{id}-{guestId}.txt"));
            Socket.SendTo(data, _remotePoint);
        }

        private static void Error(string errorMessage)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Error. " + errorMessage);
            Console.ResetColor();
        }

        private static void DisplayMessageHistory()
        {
            Console.Clear();
            if (guestId == default)
            {
                foreach (var mes in Messages)
                {
                    Console.WriteLine(mes);
                }
                return;
            }

            if (Messages.Count != 0)
            {
                foreach (var mes in Messages)
                {
                   AddMessage(guestId, mes); 
                }
                Messages.Clear();
            }
            try
            {
                string text = System.IO.File.ReadAllText(Environment.CurrentDirectory + $"/{id}-{guestId}.txt");
                Console.WriteLine(text);
            }
            catch
            {
                Error("Fail in reading history");
            }
            
        }

        private static void RecoverMessages(string text)
        {
            string idRecover = "";
            for (int i = 1; i < text.Length; i++)
            {
                if (text[i] == SeparatorStick)
                {
                    text = text.Remove(0, i);
                    break;
                }
                idRecover += text[i];
            }

            string temp = "";
            for (int i = 0; i <text.Length; i++)
            {
                if (text[i] == '\n')
                {
                    AddMessage(new Guid(idRecover),temp);
                    continue;
                }
                temp += text[i];
            }
        }
        static void AddMessage(Guid guestId, string message)
        {
            File.AppendAllText(Environment.CurrentDirectory + $"/{id}-{guestId}.txt", message + Environment.NewLine);
        }

        static void Main(string[] args)
        {
            StartPage();
            Thread receive = new (ReceiveMessages);
            receive.Start();
            Thread send = new (SendMessage);
            send.Start();
        }
    }
}